# 🩺 Inglês Médico

Plataforma gratuita, em HTML/CSS/JavaScript puro, para praticar **inglês médico** no estilo Duolingo: trilha com níveis, lições curtas, XP, ofensiva diária, flashcards com repetição espaçada, dicionário pessoal e casos clínicos simples.

## Como usar

- **Online:** ative o GitHub Pages (Settings → Pages → Deploy from branch → `main` / root) e acesse a URL gerada.
- **Local:** basta abrir o `index.html` no navegador. Não tem instalação nem build.

### Salvar e levar o progresso para outro navegador

O progresso fica salvo no próprio navegador (`localStorage`). Clique no **💾** da barra superior (ou em **Perfil → Salvar e transferir progresso**) e escolha uma opção:

- **Arquivo JSON:** baixe o arquivo `.json` e, no outro navegador, use **Carregar arquivo**. É a melhor opção para guardar backup (Drive, e-mail).
- **Link de transferência:** copie o link e abra-o no outro navegador ou celular. Os dados vão compactados dentro do próprio link e nada é enviado para servidor.
- **Copiar/colar código:** a mesma ideia do link, só que em texto. O campo de colar também aceita o JSON ou o link.

Na hora de carregar, se o navegador já tiver progresso, dá para **Mesclar** (fica com o melhor dos dois: XP, lições, flashcards, meu dicionário e anotações) ou **Substituir**. A tela inicial lembra de fazer backup quando passam 7 dias sem um.

## Funcionalidades

| Área | O que tem |
|---|---|
| **Aprender** | Trilha com 4 seções (A1 → B2) e 20 unidades. Cada unidade tem Lição 1, Lição 2, Lição 3, Leitura e Desafio final (é preciso 70% para passar). As unidades vão sendo desbloqueadas em sequência, ou todas de uma vez no *modo livre*. |
| **Exercícios** | Tradução EN↔PT, ouvir e escolher, definição → termo, completar lacunas, montar frases, combinar pares, escrever, ditado e pronúncia com microfone. Quem erra revê o exercício no fim da lição. |
| **Praticar** | Revisão inteligente (repetição espaçada), treino misto, meus erros, meu dicionário, contra o relógio (60 s), ditado, pronúncia, prefixos e abreviações. |
| **Flashcards** | Cartões que viram, em EN→PT ou PT→EN. Você avalia com Errei / Difícil / Bom / Fácil e o app agenda a próxima revisão (caixas de Leitner). |
| **Dicionário** | 320 termos com tradução, pronúncia aproximada, definição em inglês simples, frase de exemplo, áudio e links para YouGlish, Cambridge e Merriam-Webster. |
| **⭐ Meu dicionário** | Salve as palavras difíceis com ★ (no dicionário, nas lições e nos flashcards), crie palavras próprias e faça anotações. As palavras que você erra aparecem como sugestão. Dá para exportar para Anki ou CSV e imprimir. |
| **Casos clínicos** | 8 casos curtos em inglês simples, com glossário clicável, áudio e perguntas de compreensão. |
| **Progresso** | Nível (de Calouro a Lenda da Medicina), XP, ofensiva, precisão, gráfico de XP dos últimos 14 dias com a meta e 20 conquistas com o andamento de cada uma. |
| **Ajustes** | Nome, meta diária, sotaque US/UK, velocidade do áudio, efeitos, exercícios de fala, modo livre, tema e backup. |

O áudio usa a síntese de voz do próprio navegador. O exercício de pronúncia precisa de reconhecimento de voz (Chrome ou Edge).

## Conteúdo

As unidades **Cabeça: crânio e face**, **Esqueleto axial**, **Músculos da face** e **Radiografia e imagem** partem dos materiais de Inglês Médico (The Human Body – Head, Axial Skeleton, Facial Muscles, Radiography). A página de recursos usa as indicações do manual *Como melhorar seu inglês médico*.

O restante foi ampliado com base em informações de fontes oficiais de saúde: MedlinePlus (NIH/NLM), OMS, CDC, NHS e American Heart Association. São 16 unidades a mais, cobrindo hospital, corpo humano, sintomas, anamnese, exame físico, terminologia, sistemas do corpo, medicamentos, emergência/BLS, exames laboratoriais, abreviações e falsos cognatos.

## Estrutura

```
index.html      # casca da aplicação
css/style.css   # estilos (responsivo, tema claro/escuro)
js/data.js      # todo o conteúdo: unidades, palavras, leituras, casos, recursos
js/charts.js    # gráfico de barras do Progresso (SVG, sem dependências)
js/app.js       # lógica: trilha, exercícios, SRS, dicionário, progresso, ajustes
```

### Design

O visual segue o estilo *Editorial greeting* da skill [taste-skill](https://github.com/leonxlnx/taste-skill):

- uma saudação em serifa que traz o dado do dia ("Bom dia, Ana. 5 palavras para revisar…");
- painéis em tons planos, sem sombras, gradientes nem emoji;
- Instrument Sans e Instrument Serif;
- o verde-azulado como única cor de destaque, usada nos dados: a trilha de 5 etapas de cada unidade e o dia de hoje no gráfico;
- tema claro e escuro.

### Adicionar conteúdo

Edite `js/data.js`. Cada palavra segue o formato:

```js
W("Inglês", "Português", "pronúncia aproximada", "Definição simples em inglês.", "Frase de exemplo que contém o termo.")
```

A frase de exemplo precisa conter o termo em inglês, porque é dela que saem os exercícios de lacuna e de montar frase. Para criar uma unidade nova, adicione um objeto em `UNITS` com `id`, `section`, `icon`, `title`, `en`, `words` e `reading`.

> Conteúdo educacional para prática de idioma. Não substitui fontes clínicas nem orientação médica.
