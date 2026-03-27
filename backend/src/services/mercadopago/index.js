// 250306V


import MercadoPago, { PreApprovalPlan, PreApproval, Preference, Payment } from 'mercadopago';
import { env } from '../env';


const MP_BACK_SUCCESS = env.MP_BACK_SUCCESS;
const MP_BACK_FAILURE = env.MP_BACK_FAILURE;
const MP_BACK_PENDING = env.MP_BACK_PENDING;


class MercadoPagoService {
    constructor() {
        if (!env.MP_CLIENT_SECRET) console.error('> [MercadoPago] Error: Não existe MP_CLIENT_SECRET definido. Verifique as variáveis de ambiente.');

        this.client = new MercadoPago({
            accessToken: env.MP_CLIENT_SECRET,
            options: {
                timeout: 5000
            }
        });
    }


    /**
     * Cria um pagamento único utilizando o Checkout Pro do Mercado Pago
     * @param {Object} paymentData - Dados do pagamento
     * @param {Object} paymentData.plan - Dados do plano
     * @param {string} paymentData.plan.reason - Nome/descrição do pagamento ou produto
     * @param {number} paymentData.plan.amount - Valor do pagamento
     * @param {string} [paymentData.plan.id] - ID do plano (opcional)
     * @param {Object} paymentData.user - Dados do comprador
     * @param {string} paymentData.user.email - Email do comprador
     * @param {string} paymentData.user.name - Nome completo do comprador
     * @param {string} [paymentData.user.first_name] - Primeiro nome do comprador (opcional)
     * @param {string} [paymentData.user.lastName] - Sobrenome do comprador (opcional)
     * @param {string} paymentData.user.id - Identificador externo do usuário (para referência)
     * @param {Object} paymentData.metadata - Adiciona dados ao metadados
     * @returns {Promise<Object>} { success, preference } ou { success, error }
     */
    async createCheckout(paymentData) {
        try {
            const preference = new Preference(this.client);
            const body = {
                items: [
                    {
                        id: paymentData.plan.id,
                        title: paymentData.plan.reason,
                        quantity: 1,
                        currency_id: 'BRL',
                        unit_price: paymentData.plan.amount,
                    }
                ],
                metadata: {
                    title: paymentData.plan.reason,
                    unit_price: paymentData.plan.amount,
                    plan_id: paymentData.plan.id,
                    user_id: paymentData.user.id,
                    ...paymentData?.metadata || {}
                },
                notification_url: `${MP_BACK_SUCCESS}`,
                external_reference: paymentData.user.id,
                payer: {
                    name: paymentData.user.name,
                    first_name: paymentData.user.first_name || paymentData.user.name,
                    last_name: paymentData.user.lastName || '',
                    email: paymentData.user.email,
                    address: {
                        street_name: paymentData.user?.address?.street,
                        street_number: paymentData.user?.address?.number,
                    }
                },
                back_urls: {
                    success: `${MP_BACK_SUCCESS}`,
                    failure: `${MP_BACK_FAILURE}`,
                    pending: `${MP_BACK_PENDING}`,
                },
                redirect_urls: {
                    success: `${MP_BACK_SUCCESS}`,
                    failure: `${MP_BACK_FAILURE}`,
                    pending: `${MP_BACK_PENDING}`,
                },
                auto_return: 'all',
                category_id: "category",
            };
            const res = await preference.create({ body });
            return { success: true, preference: res };
        } catch (error) {
            console.error('> [MercadoPago] Error: Ao criar pagamento único via Checkout Pro:', JSON.stringify(error, null, 2));
            return { success: false, error };
        }
    }


    /**
     * Faz a busca por pagamentos
     * @param {string} checkout_id - ID do checkout
     * @returns {Promise<Object>} { success, checkout, checkouts } ou { success, error }
     */
    async readCheckout(checkout_id = null, filter = {}) {
        try {
            const req = new Preference(this.client);

            if (checkout_id) {
                const checkout = await req.get({ preferenceId: checkout_id });
                return { success: !!checkout, checkout };
            }

            const checkouts = await req.search({ options: filter });
            return { success: !!checkouts, checkouts };

        } catch (error) {
            console.error('> [MercadoPago] Error: Ao obter checkout de pagamento:', JSON.stringify(error, null, 2));
            return { success: false, checkout: false, checkouts: false, error };
        }
    }


    /**
     * Faz a busca por pagamentos
     * @param {string} payment_id - ID do payment
     * @returns {Promise<Object>} { success, payment, payments } ou { success, error }
     */
    async readPayment(payment_id = null, filter = {}) {
        try {
            const req = new Payment(this.client);

            if (payment_id) {
                const payment = await req.get({ id: payment_id });
                return { success: !!payment, payment };
            }

            const payments = await req.search({ options: filter });
            return { success: !!payments, payments };

        } catch (error) {
            console.error('> [MercadoPago] Error: Ao obter payment:', JSON.stringify(error, null, 2));
            return { success: false, payment: false, payments: false, error };
        }
    }


    /**
     * Cria um plano de assinatura no Mercado Pago
     * @param {Object} planData - Dados do plano
     * @param {string} planData.reason - Motivo/nome do plano
     * @param {number} planData.amount - Valor da assinatura
     * @param {number} planData.frequency - Frequência de cobrança
     * @param {string} planData.frequencyType - Tipo de frequência (days, months)
     * @param {number} planData.repetitions - Número de repetições (opcional) - desativado
     * @param {number} planData.billingDay - Dia de cobrança (opcional) - desativado
     * @returns {Promise<Object>} { success, plan } ou { success, error }
     */
    async createPlan(planData) {
        try {
            const plan = new PreApprovalPlan(this.client);
            const body = {
                reason: planData.reason,
                back_url: MP_BACK_URL_PLAN,
                auto_recurring: {
                    frequency: planData?.frequency || 1,
                    frequency_type: planData?.frequencyType || "months",
                    transaction_amount: planData.amount,
                    currency_id: 'BRL',
                },
                payment_methods_allowed: {
                    payment_types: [
                        // { id: 'credit_card' },
                        {}
                    ]
                }
            };

            // Adiciona período de teste gratuito se fornecido
            if (planData.freeTrial) {
                body.auto_recurring.free_trial = {
                    frequency: planData.freeTrial.frequency,
                    frequency_type: planData.freeTrial.frequencyType
                };
            }

            const result = await plan.create({ body });
            return { success: true, plan: result };
        } catch (error) {
            console.error('> [MercadoPago] Error: Ao criar plano de assinatura:', JSON.stringify(error, null, 2));
            return { success: false, error };
        }
    }


    /**
     * Obtém detalhes de um plano de assinatura específico
     * @param {string} planId - ID do plano
     * @returns {Promise<Object>} { success, plan, plans } ou { success, error }
     */
    async getPlan(planId = null, filter = {}) {
        try {
            const req = new PreApprovalPlan(this.client);

            if (planId) {
                const plan = await req.get({ id: planId });
                return { success: !!plan, plan };
            }

            const plans = await req.search({ options: filter });
            return { success: !!plans, plans };

        } catch (error) {
            console.error('> [MercadoPago] Error: Ao obter plano de assinatura:', JSON.stringify(error, null, 2));
            return { success: false, plan: false, plans: false, error };
        }
    }


    /**
     * Atualiza um plano de assinatura existente
     * @param {string} planId - ID do plano
     * @param {Object} planData - Dados do plano a serem atualizados
     * @returns {Promise<Object>} { success, plan } ou { success, error }
     */
    async updatePlan(planId, planData) {
        try {
            const plan = new PreApprovalPlan(this.client);
            const result = await plan.update({ id: planId, body: planData });
            return { success: true, plan: result };
        } catch (error) {
            console.error('> [MercadoPago] Error: Ao atualizar plano de assinatura:', JSON.stringify(error, null, 2));
            return { success: false, error };
        }
    }


    /**
     * Cria uma assinatura para um usuário em um plano específico
     * @param {Object} subscriptionData - Dados da assinatura
     * @param {string} subscriptionData.planId - ID do plano
     * @param {string} subscriptionData.payerEmail - Email do pagador
     * @param {string} subscriptionData.cardTokenId - Token do cartão
     * @param {string} subscriptionData.reason - Motivo da assinatura
     * @param {number} subscriptionData.amount - Valor da assinatura
     * @param {string} subscriptionData.externalReference - Referência externa (opcional)
     * @param {string} subscriptionData.name - Nome do pagador
     * @param {string} subscriptionData.lastName - Sobrenome do pagador (opcional)
     * @returns {Promise<Object>} { success, subscription } ou { success, error }
     */
    async createSubscription(subscriptionData) {
        // console.log("payer_email:", subscriptionData.payerEmail);


        // Define a data de início para 2 minutos no futuro
        const startDate = new Date();
        startDate.setMinutes(startDate.getMinutes() + 5);


        try {
            const subscription = new PreApproval(this.client);
            const subscriptionBody = {
                // preapproval_plan_id: subscriptionData.planId,
                metadata: {
                    plan_id: subscriptionData.planId,
                    user_id: subscriptionData.userId,
                },
                reason: subscriptionData.reason,
                payer_email: subscriptionData.payerEmail,
                // card_token_id: subscriptionData.cardTokenId,
                status: 'pending',
                back_url: `${MP_BACK_URL}?status=assinatura`,
                back_urls: {
                    success: `${MP_BACK_URL}?status=assinatura_success`,
                    failure: `${MP_BACK_URL}?status=assinatura_failure`,
                    pending: `${MP_BACK_URL}?status=assinatura_pending`,
                },
                redirect_urls: {
                    success: `https://images.emojiterra.com/google/noto-emoji/unicode-16.0/bw/1024px/2714.png`,
                    failure: `https://images.emojiterra.com/google/noto-emoji/animated-emoji/274c.gif`,
                    pending: `https://images.emojiterra.com/google/noto-emoji/unicode-16.0/bw/1024px/1f503.png`,
                },
                notification_url: `https://webhook.site/db05827d-a370-45ab-8cf4-99e320149216?=${subscriptionData.reason}`,
                payer: {
                    fist_name: subscriptionData.name,
                    last_name: subscriptionData.lastName || "",
                    email: subscriptionData.payerEmail,
                    address: {
                        street_name: subscriptionData?.address?.street,
                        street_number: subscriptionData?.address?.number,
                    }
                },
                auto_recurring: {
                    frequency: 1,
                    frequency_type: 'months',
                    transaction_amount: subscriptionData.amount,
                    currency_id: 'BRL',
                    category_id: "category",
                },
                payment_methods_allowed: {
                    payment_types: [
                        { id: 'credit_card' },
                    ]
                },
                category_id: "category",
                auto_return: "approved",
            };

            // Adiciona referência externa se fornecida
            if (subscriptionData.externalReference) subscriptionBody.external_reference = subscriptionData.externalReference;

            // Adiciona URL de retorno se fornecida
            if (subscriptionData.backUrl) subscriptionBody.back_url = subscriptionData.backUrl;

            const result = await subscription.create({ body: subscriptionBody });
            return { success: true, subscription: result };
        } catch (error) {
            console.error('> [MercadoPago] Error: Ao criar assinatura:', JSON.stringify(error, null, 2));
            return { success: false, error };
        }
    }


    /**
     * Obtém detalhes de uma assinatura específica ou realiza busca com filtros
     * @param {string|null} subscription_id - ID da assinatura (opcional)
     * @param {Object} filter - Filtros para busca
     * @returns {Promise<Object>} { success, subscription } ou { success, subscriptions } ou { success, error }
     */
    async readSubscription(subscription_id = null, filter = {}) {
        try {
            const subscription = new PreApproval(this.client);

            if (subscription_id) {
                const result = await subscription.get({ id: subscription_id });
                return { success: true, subscription: result };
            }

            const result = await subscription.search({ options: filter });
            return { success: true, subscriptions: result };

        } catch (error) {
            console.error('> [MercadoPago] Error: Ao obter assinatura:', JSON.stringify(error, null, 2));
            return { success: false, error };
        }
    }


    /**
     * Cancela uma assinatura existente
     * @param {string} subscriptionId - ID da assinatura
     * @returns {Promise<Object>} { success, subscription } ou { success, error }
     */
    async cancelSubscription(subscriptionId) {
        try {
            const subscription = new PreApproval(this.client);
            const result = await subscription.update({ id: subscriptionId, body: { status: 'cancelled' } });
            return { success: true, subscription: result };
        } catch (error) {
            console.error('> [MercadoPago] Error: Ao cancelar assinatura:', JSON.stringify(error, null, 2));
            return { success: false, error };
        }
    }


    /**
     * Pausa uma assinatura existente
     * @param {string} subscriptionId - ID da assinatura
     * @returns {Promise} Retorna a assinatura pausada
     */
    async pauseSubscription(subscriptionId) {
        try {
            const subscription = new PreApproval(this.client);
            const result = await subscription.update({ id: subscriptionId, body: { status: 'paused' } });
            return result;
        } catch (error) {
            console.error('> [MercadoPago] Error: Ao pausar assinatura:', JSON.stringify(error, null, 2));
            throw error;
        }
    }


    /**
     * Reativa uma assinatura pausada
     * @param {string} subscriptionId - ID da assinatura
     * @returns {Promise<Object>} { success, subscription } ou { success, error }
     */
    async reactivateSubscription(subscriptionId) {
        try {
            const subscription = new PreApproval(this.client);
            const result = await subscription.update({ id: subscriptionId, body: { status: 'authorized' } });
            return { success: true, subscription: result };
        } catch (error) {
            console.error('> [MercadoPago] Error: Ao reativar assinatura:', JSON.stringify(error, null, 2));
            return { success: false, error };
        }
    }
}


export default new MercadoPagoService();
