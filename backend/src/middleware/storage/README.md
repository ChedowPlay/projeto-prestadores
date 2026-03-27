# Como ver o código hex da imagem para determinar o formato correto

Você pode usar o xxd no Linux/macOS ou o certutil no Windows para visualizar o código hexadecimal da imagem e identificar seu formato.

## Linux/macOS (usando xxd)

  xxd -l 16 imagem.png

Isso exibe os primeiros 16 bytes do arquivo, onde geralmente está a assinatura do formato.

## Windows (usando certutil)

  certutil -encodehex imagem.png 16

para exibir os primeiros bytes diretamente:

  certutil -dump imagem.png

## Exemplo de Assinaturas de Arquivo (Magic Numbers)

  PNG → 89 50 4E 47 0D 0A 1A 0A
  
  JPEG → FF D8 FF
  
  WEBP → 52 49 46 46 xx xx xx xx 57 45 42 50
  WEBP → RIFF.j..WEBPVP8
  
  GIF → 47 49 46 38 39 61 ou 47 49 46 38 37 61
