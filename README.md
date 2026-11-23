# 🩺 Inglês Médico

Plataforma gratuita, em HTML/CSS/JavaScript puro, para praticar **inglês médico** no estilo Duolingo, do inglês básico até o **USMLE**: nivelamento com lição de triagem, trilha por nível, lições curtas, XP, ofensiva diária, flashcards com repetição espaçada, **9.733 Flash cards USMLE Step 1**, dicionário pessoal e casos clínicos.

## Como usar

- **Online:** ative o GitHub Pages (Settings → Pages → Deploy from branch → `main` / root) e acesse a URL gerada.
- **Local:** basta abrir o `index.html` no navegador. Não tem instalação nem build.

### Salvar e levar o progresso para outro navegador

O progresso fica salvo no próprio navegador (`localStorage`). Clique em **Salvar dados** no menu (ou no 💾 da barra do celular, ou em **Ajustes → Seus dados**) e escolha uma opção:

- **Arquivo JSON:** baixe o arquivo `.json` e, no outro navegador, use **Carregar arquivo**. É a melhor opção para guardar backup (Drive, e-mail).
- **Link de transferência:** copie o link e abra-o no outro navegador ou celular. Os dados vão compactados dentro do próprio link e nada é enviado para servidor.
- **Copiar/colar código:** a mesma ideia do link, só que em texto. O campo de colar também aceita o JSON ou o link.

Na hora de carregar, se o navegador já tiver progresso, dá para **Mesclar** (fica com o melhor dos dois: XP, lições, flashcards, meu dicionário e anotações) ou **Substituir**. A tela inicial lembra de fazer backup quando passam 7 dias sem um.

## Funcionalidades

| Área | O que tem |
|---|---|
| **Nivelamento** | No primeiro acesso, a pessoa escolhe o nível ou faz a **lição de triagem** (18 perguntas em 5 partes: inglês geral, inglês médico básico, inglês clínico, inglês avançado e conteúdo do Step 1). O resultado diz o nível e por onde começar. Dá para mudar o nível ou refazer a triagem em **Ajustes**. |
| **Níveis** | **Básico** (“quero aprender inglês”): começa na Seção 0, inglês do zero. **Intermediário · Fase 1** (“já sei inglês, agora quero aprender inglês médico”): começa na Seção 1. **Intermediário · Fase 2**: começa na Seção 3. **Avançado** (“já sei bastante e quero me aprofundar”): começa na Seção 5 (C1). **USMLE** (“quero me preparar para a prova”): abre direto nos Flash cards USMLE. As seções anteriores ao ponto de partida ficam abertas para revisão. |
| **Aprender** | Trilha com 6 seções (A0 → C1) e 28 unidades. Cada unidade tem Lição 1, Lição 2, Lição 3, Leitura e Desafio final (é preciso 70% para passar). As unidades vão sendo desbloqueadas em sequência a partir do nível, ou todas de uma vez no *modo livre*. |
| **Flash cards USMLE** | 9.733 cartões originais do Step 1 em 16 matérias (Biochemistry, Behavioral Science, Cardiovascular, Embryology, Endocrinology, Gastrointestinal, Hematology & Oncology, Immunology, Microbiology, Musculoskeletal, Neurology, Pharmacology, Psychiatry, Renal, Reproductive, Respiratory). Pergunta e resposta em inglês; a explicação curta em português é **opcional**: aparece com um toque, ou sempre, se a chave “Explicação em PT” estiver ligada. Repetição espaçada própria, revisão do dia de todas as matérias, filtro por tema e atalhos de teclado (espaço, 1–4, P). |
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
index.html          # casca da aplicação
css/style.css       # estilos (responsivo, tema claro/escuro)
js/data.js          # conteúdo das Seções 1 a 4: unidades, palavras, leituras, casos, recursos
js/data-niveis.js   # Seção 0 (Básico, inglês do zero) e Seção 5 (Avançado, C1)
js/usmle/index.js   # índice dos Flash cards USMLE (matérias, temas e totais)
js/usmle/<matéria>.js  # cartões de cada matéria, carregados só quando a matéria é aberta
js/charts.js        # gráfico de barras do Progresso (SVG, sem dependências)
js/app.js           # lógica: nível e triagem, trilha, exercícios, SRS, USMLE, dicionário, progresso, ajustes
```

Cada cartão USMLE é `[id, pergunta, resposta em inglês, explicação em português]`. O progresso fica em `usmle.srs` no mesmo `localStorage` e entra no backup, no link de transferência e na mesclagem.

### Design

O visual é no estilo Duolingo:

- **Trilha:** nós redondos em 3D num caminho em zigue-zague, cinco por unidade (três lições, a leitura e o desafio). Ao tocar num nó, abre um balão com a etapa e o botão de começar.
- **Unidades:** cada uma tem uma faixa colorida com o botão "Guia", e as cores mudam por seção (verde, azul, roxo e laranja).
- **Doc, o mascote:** acompanha a trilha, dá as boas-vindas e comemora o fim das lições.
- **Coluna lateral:** mostra a ofensiva, a meta diária, as **missões do dia** (bônus de +20 XP ao completar as quatro), a palavra do dia e o meu dicionário. No celular, ela vira uma barra compacta no topo.
- **Lições:** contador de acertos seguidos, botões 3D, fonte Nunito e retorno verde ou vermelho no rodapé.
- **Temas:** claro e escuro.

### Adicionar conteúdo

Edite `js/data.js`. Cada palavra segue o formato:

```js
W("Inglês", "Português", "pronúncia aproximada", "Definição simples em inglês.", "Frase de exemplo que contém o termo.")
```

A frase de exemplo precisa conter o termo em inglês, porque é dela que saem os exercícios de lacuna e de montar frase. Para criar uma unidade nova, adicione um objeto em `UNITS` com `id`, `section`, `icon`, `title`, `en`, `words` e `reading`.

> Conteúdo educacional para prática de idioma. Não substitui fontes clínicas nem orientação médica.
