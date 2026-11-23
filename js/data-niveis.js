/* Conteúdo dos níveis novos: Básico (inglês do zero) e Avançado (C1).
 * Carregado depois do data.js: a Seção 0 entra antes da trilha original e a Seção 5 depois dela.
 * Mesmo formato do data.js: W(inglês, português, pronúncia, definição em inglês simples, frase, tradução da frase).
 */
SECTIONS.unshift({ id: "s0", title: "Inglês essencial", level: "A0–A1", desc: "Para quem está começando: cumprimentos, verbos do dia a dia, perguntas e números." });
SECTIONS.push({ id: "s5", title: "Aprofundamento", level: "C1", desc: "Apresentação de casos, fisiopatologia, artigos científicos, comunicação difícil e a linguagem do USMLE." });

UNITS.unshift(
  {
    id: "greetings", section: "s0", icon: "👋", title: "Cumprimentos e apresentações", en: "Greetings and introductions",
    words: [
      W("Hello", "Olá", "Rel-lôu", "A word you say when you meet someone.", "Hello, my name is Ana.", "Olá, meu nome é Ana."),
      W("Good morning", "Bom dia", "Gud mór-nin", "A greeting used before noon.", "Good morning, doctor!", "Bom dia, doutor!"),
      W("Good night", "Boa noite (ao se despedir)", "Gud náit", "Something you say when you leave at night or go to bed.", "Good night, see you tomorrow.", "Boa noite, até amanhã."),
      W("Name", "Nome", "Nêim", "The word people use to call you.", "What is your name?", "Qual é o seu nome?"),
      W("Nice to meet you", "Prazer em conhecer você", "Náis tu mít iú", "A polite phrase when you meet someone for the first time.", "Nice to meet you, Mr. Brown.", "Prazer em conhecer o senhor, Sr. Brown."),
      W("Please", "Por favor", "Plíz", "A polite word used when you ask for something.", "Sit down, please.", "Sente-se, por favor."),
      W("Thank you", "Obrigado(a)", "Fénk iú", "Words you say when someone helps you.", "Thank you for your help.", "Obrigado pela sua ajuda."),
      W("Sorry", "Desculpe", "Só-ri", "A word you say when you make a mistake.", "Sorry, I am late.", "Desculpe, estou atrasado."),
      W("Excuse me", "Com licença", "Ex-kiúz mí", "A polite phrase to get attention or to pass by someone.", "Excuse me, where is the pharmacy?", "Com licença, onde fica a farmácia?"),
      W("Goodbye", "Tchau / até logo", "Gud-bái", "A word you say when you leave.", "Goodbye, and take care.", "Tchau, e se cuide."),
      W("Friend", "Amigo(a)", "Frend", "A person you like and know well.", "My friend is a nurse.", "Minha amiga é enfermeira."),
      W("Doctor", "Médico(a) / doutor(a)", "Dók-tãr", "A person who treats sick people.", "The doctor is very kind.", "A médica é muito gentil."),
      W("Patient", "Paciente", "Pêi-shent", "A person who receives medical care.", "The patient is in room five.", "O paciente está no quarto cinco."),
      W("Welcome", "Bem-vindo(a)", "Uél-kãm", "A word to greet someone who arrives.", "Welcome to the clinic.", "Bem-vindo à clínica.")
    ],
    reading: {
      title: "First day at the clinic",
      text: "Hello! My name is Paulo. I am a medical student from Brazil. Today is my first day at a clinic in London. The receptionist says, \"Good morning! Welcome to the clinic.\" I say, \"Thank you! Nice to meet you.\" Then I meet Dr. Green. She is very friendly. At the end of the day, I say, \"Goodbye, see you tomorrow!\"",
      pt: "Olá! Meu nome é Paulo. Sou estudante de medicina do Brasil. Hoje é meu primeiro dia numa clínica em Londres. A recepcionista diz: \"Bom dia! Bem-vindo à clínica.\" Eu digo: \"Obrigado! Prazer em conhecê-la.\" Depois conheço a Dra. Green. Ela é muito simpática. No fim do dia, eu digo: \"Tchau, até amanhã!\"",
      questions: [
        { q: "Where is Paulo from?", options: ["London", "Brazil", "Portugal", "Spain"], a: 1 },
        { q: "Who says \"Welcome to the clinic\"?", options: ["Dr. Green", "A patient", "The receptionist", "Paulo"], a: 2 },
        { q: "What does Paulo say at the end of the day?", options: ["Good morning!", "Sorry, I am late.", "Nice to meet you.", "Goodbye, see you tomorrow!"], a: 3 }
      ]
    }
  },
  {
    id: "everyday", section: "s0", icon: "🗓️", title: "Verbos do dia a dia", en: "Everyday verbs",
    words: [
      W("To be", "Ser / estar", "Tu bí", "A basic verb: I am, you are, he is.", "I want to be a good doctor.", "Eu quero ser um bom médico."),
      W("To have", "Ter", "Tu rév", "To own or to hold something.", "Adults need to have a check-up every year.", "Adultos precisam fazer um check-up todo ano."),
      W("To work", "Trabalhar", "Tu uãrk", "To do a job.", "Nurses often need to work at night.", "Enfermeiros muitas vezes precisam trabalhar à noite."),
      W("To eat", "Comer", "Tu ít", "To put food in your mouth and swallow it.", "Try to eat more vegetables.", "Tente comer mais verduras."),
      W("To drink", "Beber", "Tu drink", "To take a liquid into your mouth and swallow it.", "Remember to drink a lot of water.", "Lembre-se de beber bastante água."),
      W("To sleep", "Dormir", "Tu slíp", "To rest with your eyes closed.", "It is hard to sleep in the hospital.", "É difícil dormir no hospital."),
      W("To feel", "Sentir(-se)", "Tu fíl", "To have an emotion or a sensation in your body.", "It is normal to feel tired after surgery.", "É normal se sentir cansado depois da cirurgia."),
      W("To help", "Ajudar", "Tu rélp", "To make things easier for someone.", "I am here to help you.", "Estou aqui para ajudar você."),
      W("To speak", "Falar", "Tu spík", "To say words with your voice.", "I want to speak English at work.", "Quero falar inglês no trabalho."),
      W("To understand", "Entender", "Tu ân-dãr-sténd", "To know the meaning of something.", "It is easy to understand this word.", "É fácil entender esta palavra."),
      W("To need", "Precisar", "Tu níd", "When something is necessary for you.", "Patients with type 1 diabetes tend to need insulin.", "Pacientes com diabetes tipo 1 costumam precisar de insulina."),
      W("To take", "Tomar / pegar", "Tu têik", "To get something; with medicine it means to swallow it.", "Remember to take your medicine after lunch.", "Lembre-se de tomar o remédio depois do almoço."),
      W("To go", "Ir", "Tu gôu", "To move from one place to another.", "I have to go to the hospital now.", "Tenho que ir ao hospital agora."),
      W("To come", "Vir", "Tu kâm", "To move toward the place where the speaker is.", "Ask him to come back next week.", "Peça a ele para voltar na semana que vem.")
    ],
    reading: {
      title: "A busy day",
      text: "Maria is a nurse. She likes to work in the morning. She wakes up at six, drinks a cup of coffee and goes to the hospital by bus. At work, she helps the doctors and speaks with the patients. She understands a little English, but she wants to speak better. At night she is tired, so she eats dinner and goes to sleep early.",
      pt: "Maria é enfermeira. Ela gosta de trabalhar de manhã. Ela acorda às seis, bebe uma xícara de café e vai ao hospital de ônibus. No trabalho, ela ajuda os médicos e conversa com os pacientes. Ela entende um pouco de inglês, mas quer falar melhor. À noite ela está cansada, então janta e vai dormir cedo.",
      questions: [
        { q: "When does Maria like to work?", options: ["At night", "In the morning", "On weekends", "In the afternoon"], a: 1 },
        { q: "How does she go to the hospital?", options: ["By bus", "By car", "On foot", "By train"], a: 0 },
        { q: "What does she want to do better?", options: ["Cook", "Drive", "Speak English", "Sleep"], a: 2 }
      ]
    }
  },
  {
    id: "questions", section: "s0", icon: "❓", title: "Perguntas, números e tempo", en: "Questions, numbers and time",
    words: [
      W("What", "O que / qual", "Uót", "A word to ask about a thing or some information.", "What is your phone number?", "Qual é o seu telefone?"),
      W("Where", "Onde", "Uér", "A word to ask about a place.", "Where does it hurt?", "Onde dói?"),
      W("When", "Quando", "Uén", "A word to ask about time.", "When did the pain start?", "Quando a dor começou?"),
      W("Who", "Quem", "Rú", "A word to ask about a person.", "Who is your family doctor?", "Quem é o seu médico de família?"),
      W("How", "Como", "Ráu", "A word to ask about the way or the condition of something.", "How do you feel today?", "Como você se sente hoje?"),
      W("How many", "Quantos(as)", "Ráu mé-ni", "A phrase to ask about a number of things.", "How many pills do you take a day?", "Quantos comprimidos você toma por dia?"),
      W("How old", "Quantos anos (idade)", "Ráu ôuld", "A phrase to ask about age.", "How old are you?", "Quantos anos você tem?"),
      W("Why", "Por que", "Uái", "A word to ask about the reason.", "Why are you here today?", "Por que você veio hoje?"),
      W("Today", "Hoje", "Tu-dêi", "This day.", "Today is Monday.", "Hoje é segunda-feira."),
      W("Yesterday", "Ontem", "Iés-tãr-dêi", "The day before today.", "The fever started yesterday.", "A febre começou ontem."),
      W("Tomorrow", "Amanhã", "Tu-mó-rou", "The day after today.", "Come back tomorrow morning.", "Volte amanhã de manhã."),
      W("Hour", "Hora", "Áuãr", "A period of sixty minutes.", "The test takes one hour.", "O exame leva uma hora."),
      W("Week", "Semana", "Uík", "A period of seven days.", "I will see you next week.", "Vejo você na semana que vem."),
      W("Twenty", "Vinte", "Tuén-ti", "The number 20.", "She is twenty years old.", "Ela tem vinte anos.")
    ],
    reading: {
      title: "At the reception",
      text: "Receptionist: Good afternoon. What is your name? Patient: John Smith. Receptionist: How old are you, Mr. Smith? Patient: I am forty-two. Receptionist: Why are you here today? Patient: I have a headache. It started yesterday. Receptionist: OK. The doctor can see you in one hour. Please wait here.",
      pt: "Recepcionista: Boa tarde. Qual é o seu nome? Paciente: John Smith. Recepcionista: Quantos anos o senhor tem, Sr. Smith? Paciente: Tenho quarenta e dois. Recepcionista: Por que o senhor veio hoje? Paciente: Estou com dor de cabeça. Começou ontem. Recepcionista: Certo. O médico pode atendê-lo em uma hora. Por favor, aguarde aqui.",
      questions: [
        { q: "How old is Mr. Smith?", options: ["Twenty", "Thirty", "Forty-two", "Sixty"], a: 2 },
        { q: "When did the headache start?", options: ["Yesterday", "Today", "Last week", "Tomorrow"], a: 0 },
        { q: "When can the doctor see him?", options: ["Tomorrow", "In one hour", "Next week", "Right now"], a: 1 }
      ]
    }
  }
);

UNITS.push(
  {
    id: "presenting", section: "s5", icon: "🎤", title: "Apresentando um caso", en: "Presenting a case",
    words: [
      W("Chief complaint", "Queixa principal", "Tchíf kãm-plêint", "The main problem that brought the patient to medical care.", "Her chief complaint was chest pain for two hours.", "A queixa principal dela era dor no peito havia duas horas."),
      W("History of present illness", "História da doença atual", "Rís-to-ri óv pré-zent í-lnes", "A detailed story of the current problem, in time order.", "The history of present illness began three days ago with fever.", "A história da doença atual começou há três dias, com febre."),
      W("Past medical history", "Antecedentes pessoais", "Pést mé-di-kãl rís-to-ri", "The patient's previous diseases, surgeries and hospital stays.", "His past medical history includes hypertension and asthma.", "Os antecedentes dele incluem hipertensão e asma."),
      W("Unremarkable", "Sem alterações", "Ân-ri-már-ka-bãl", "Normal; with no important findings.", "The abdominal exam was unremarkable.", "O exame do abdome foi sem alterações."),
      W("Denies", "Nega", "Di-náiz", "Says that he or she does not have a symptom.", "She denies fever or weight loss.", "Ela nega febre ou perda de peso."),
      W("Onset", "Início (de um sintoma)", "Ón-set", "The moment or the way a symptom started.", "The onset of pain was sudden.", "O início da dor foi súbito."),
      W("Radiates", "Irradia", "Rêi-di-eits", "Spreads from one place to another (said of pain).", "The pain radiates to the left arm.", "A dor irradia para o braço esquerdo."),
      W("Worsening", "Piora", "Uãr-se-nin", "Becoming more severe.", "He reports worsening shortness of breath at night.", "Ele relata piora da falta de ar à noite."),
      W("Relieved by", "Aliviado(a) por", "Ri-lívd bái", "Made better by something.", "The pain is relieved by rest.", "A dor melhora com repouso."),
      W("Differential diagnosis", "Diagnóstico diferencial", "Di-fe-rén-shal dai-ag-nôu-sis", "The list of possible diseases that could explain the findings.", "The differential diagnosis includes pneumonia and pulmonary embolism.", "O diagnóstico diferencial inclui pneumonia e embolia pulmonar."),
      W("Workup", "Investigação (exames)", "Uãrk-âp", "The tests done to find the diagnosis.", "The workup showed a high white cell count.", "A investigação mostrou leucócitos altos."),
      W("Assessment and plan", "Avaliação e conduta", "A-sés-ment énd plén", "The final part of a case: what you think and what you will do.", "In the assessment and plan, she suggested starting antibiotics.", "Na avaliação e conduta, ela sugeriu iniciar antibióticos."),
      W("Follow-up", "Retorno / acompanhamento", "Fó-lou-âp", "A later visit or check to see how the patient is doing.", "Schedule a follow-up visit in two weeks.", "Agende um retorno em duas semanas."),
      W("Rule out", "Descartar", "Rúl áut", "To prove that a disease is not present.", "We ordered a CT scan to rule out a stroke.", "Pedimos uma tomografia para descartar AVC.")
    ],
    reading: {
      title: "Morning report",
      text: "Mr. Lee is a 58-year-old man with a past medical history of diabetes and hypertension. His chief complaint is chest pain. The onset was sudden, two hours before admission, and the pain radiates to the jaw. It is not relieved by rest. He denies fever or cough. The physical exam is unremarkable except for sweating. The differential diagnosis includes acute coronary syndrome and aortic dissection. The workup includes an ECG and troponin. Our plan is to rule out a myocardial infarction and to monitor him in the coronary care unit.",
      pt: "O Sr. Lee é um homem de 58 anos com antecedentes de diabetes e hipertensão. A queixa principal é dor no peito. O início foi súbito, duas horas antes da internação, e a dor irradia para a mandíbula. Não melhora com repouso. Ele nega febre ou tosse. O exame físico é sem alterações, exceto por sudorese. O diagnóstico diferencial inclui síndrome coronariana aguda e dissecção de aorta. A investigação inclui ECG e troponina. A conduta é descartar infarto do miocárdio e monitorá-lo na unidade coronariana.",
      questions: [
        { q: "What is Mr. Lee's chief complaint?", options: ["Fever", "Chest pain", "Cough", "Sweating"], a: 1 },
        { q: "Which statement about the pain is true?", options: ["It is relieved by rest", "It started a week ago", "It radiates to the jaw", "It started slowly"], a: 2 },
        { q: "Why does the team order an ECG and troponin?", options: ["To rule out a myocardial infarction", "To treat diabetes", "To diagnose a cough", "To check the jaw"], a: 0 }
      ]
    }
  },
  {
    id: "mechanisms", section: "s5", icon: "⚙️", title: "Explicando a fisiopatologia", en: "Explaining mechanisms",
    words: [
      W("Leads to", "Leva a", "Lídz tu", "Causes something to happen as a result.", "Chronic hypertension leads to left ventricular hypertrophy.", "A hipertensão crônica leva à hipertrofia do ventrículo esquerdo."),
      W("Results in", "Resulta em", "Ri-zâlts in", "Has something as its effect.", "Insulin deficiency results in hyperglycemia.", "A falta de insulina resulta em hiperglicemia."),
      W("Due to", "Devido a", "Diú tu", "Because of.", "The anemia is due to chronic blood loss.", "A anemia é devida à perda crônica de sangue."),
      W("Impaired", "Prejudicado(a) / comprometido(a)", "Im-pérd", "Not working normally.", "Patients with cirrhosis have impaired protein synthesis.", "Pacientes com cirrose têm a síntese de proteínas prejudicada."),
      W("Upregulation", "Suprarregulação (aumento de receptores)", "Âp-ré-guiu-lêi-shãn", "An increase in the number of receptors or in the activity of a gene.", "Chronic blockade causes upregulation of beta receptors.", "O bloqueio crônico causa suprarregulação dos receptores beta."),
      W("Downstream", "A jusante / etapa seguinte", "Dáun-strím", "Later in a pathway or a process.", "Downstream signaling activates protein kinase A.", "A sinalização seguinte ativa a proteína quinase A."),
      W("Compensatory", "Compensatório(a)", "Kãm-pén-sa-to-ri", "Happening in order to balance a problem.", "Tachycardia is a compensatory response to blood loss.", "A taquicardia é uma resposta compensatória à perda de sangue."),
      W("Hallmark", "Marca característica", "Ról-mark", "A typical and important feature of something.", "Reed-Sternberg cells are the hallmark of Hodgkin lymphoma.", "As células de Reed-Sternberg são a marca do linfoma de Hodgkin."),
      W("Underlying", "Subjacente (de base)", "Ân-dãr-lái-in", "Being the real or basic cause.", "We must treat the underlying cause of the fever.", "Precisamos tratar a causa de base da febre."),
      W("Precipitate", "Desencadear", "Pri-sí-pi-teit", "To cause something to happen suddenly.", "Infection can precipitate diabetic ketoacidosis.", "Uma infecção pode desencadear cetoacidose diabética."),
      W("Mediated by", "Mediado(a) por", "Mí-di-ei-tid bái", "Caused or controlled through a certain substance or cell.", "Anaphylaxis is mediated by IgE and histamine.", "A anafilaxia é mediada por IgE e histamina."),
      W("Accumulation", "Acúmulo", "A-kiu-miu-lêi-shãn", "A slow increase in the amount of something.", "Copper accumulation damages the liver in Wilson disease.", "O acúmulo de cobre lesa o fígado na doença de Wilson."),
      W("Inhibits", "Inibe", "In-rí-bits", "Blocks or slows an action or a process.", "Aspirin irreversibly inhibits cyclooxygenase.", "A aspirina inibe a ciclo-oxigenase de forma irreversível."),
      W("Feedback", "Retroalimentação (feedback)", "Fíd-bék", "When the result of a process controls the process itself.", "Cortisol exerts negative feedback on ACTH release.", "O cortisol exerce feedback negativo sobre a liberação de ACTH.")
    ],
    reading: {
      title: "Why does the failing heart get worse?",
      text: "In heart failure, the heart cannot pump enough blood to meet the needs of the body. Reduced cardiac output leads to activation of the renin-angiotensin-aldosterone system. This compensatory response results in salt and water retention, which at first maintains blood pressure. Over time, however, the extra volume and the neurohormonal activation are harmful: they lead to remodeling of the ventricle and worsening function. This is why drugs that inhibit this system improve survival. Acute decompensation is often precipitated by infection, arrhythmia, or poor adherence to medication.",
      pt: "Na insuficiência cardíaca, o coração não consegue bombear sangue suficiente para as necessidades do corpo. O débito cardíaco reduzido leva à ativação do sistema renina-angiotensina-aldosterona. Essa resposta compensatória resulta em retenção de sal e água, o que no início mantém a pressão arterial. Com o tempo, porém, o volume extra e a ativação neuro-hormonal fazem mal: levam ao remodelamento do ventrículo e à piora da função. Por isso os remédios que inibem esse sistema melhoram a sobrevida. A descompensação aguda costuma ser desencadeada por infecção, arritmia ou má adesão aos remédios.",
      questions: [
        { q: "What does reduced cardiac output lead to?", options: ["Lower salt retention", "Better survival", "Activation of the renin-angiotensin-aldosterone system", "An immediate cure"], a: 2 },
        { q: "Why is the compensatory response harmful over time?", options: ["It leads to ventricular remodeling", "It lowers blood volume", "It cures infections", "It blocks aldosterone"], a: 0 },
        { q: "What can precipitate acute decompensation?", options: ["Drinking water", "Infection or arrhythmia", "Normal sleep", "Exercise training"], a: 1 }
      ]
    }
  },
  {
    id: "research", section: "s5", icon: "📑", title: "Lendo artigos científicos", en: "Reading research papers",
    words: [
      W("Abstract", "Resumo (de artigo)", "Ébs-trékt", "A short summary at the beginning of a scientific article.", "Read the abstract first to decide if the paper is useful.", "Leia o resumo primeiro para decidir se o artigo é útil."),
      W("Randomized", "Randomizado", "Rén-dã-maizd", "Assigned to groups by chance.", "This was a randomized controlled trial.", "Foi um ensaio clínico randomizado e controlado."),
      W("Outcome", "Desfecho", "Áut-kãm", "The result that a study measures.", "The primary outcome was death from any cause.", "O desfecho primário foi morte por qualquer causa."),
      W("Findings", "Achados / resultados", "Fáin-dinz", "What the researchers discovered.", "These findings support early treatment.", "Esses achados apoiam o tratamento precoce."),
      W("Significant", "Significativo(a)", "Sig-ní-fi-kent", "In statistics: unlikely to be due to chance.", "The difference was statistically significant.", "A diferença foi estatisticamente significativa."),
      W("Suggest", "Sugerir", "Sã-djést", "To indicate something without proving it.", "The data suggest a protective effect.", "Os dados sugerem um efeito protetor."),
      W("Likely", "Provável", "Láik-li", "Probably true or probably going to happen.", "Bacterial pneumonia is the likely diagnosis.", "Pneumonia bacteriana é o diagnóstico provável."),
      W("Limitation", "Limitação", "Li-mi-têi-shãn", "A weakness of a study that may affect the results.", "A major limitation was the small sample size.", "Uma limitação importante foi a amostra pequena."),
      W("Cohort", "Coorte", "Kôu-hort", "A group of people followed over time in a study.", "The cohort included two thousand adults.", "A coorte incluiu dois mil adultos."),
      W("Bias", "Viés", "Bái-as", "A systematic error that distorts the results.", "Recall bias is common in case-control studies.", "O viés de memória é comum em estudos caso-controle."),
      W("Confounder", "Fator de confusão", "Kãn-fáun-dãr", "A third variable linked to both the exposure and the outcome.", "Smoking was a confounder in the analysis.", "O tabagismo foi um fator de confusão na análise."),
      W("Placebo", "Placebo", "Pla-sí-bou", "An inactive treatment used for comparison.", "Patients received the drug or a placebo.", "Os pacientes receberam o remédio ou um placebo."),
      W("Adverse event", "Evento adverso", "Éd-vãrs i-vént", "An unwanted medical problem during treatment.", "No serious adverse event was reported.", "Nenhum evento adverso grave foi relatado."),
      W("Evidence", "Evidência", "É-vi-dens", "Information that shows whether something is true.", "There is strong evidence that statins reduce mortality.", "Há forte evidência de que as estatinas reduzem a mortalidade.")
    ],
    reading: {
      title: "Reading an abstract",
      text: "Background: The best treatment for mild hypertension in older adults is unclear. Methods: In this randomized trial, 1,200 patients were assigned to a new drug or to a placebo. The primary outcome was stroke after three years. Results: Stroke occurred in 3% of the drug group and in 5% of the placebo group; the difference was statistically significant. Adverse events were similar in both groups. Conclusions: These findings suggest that treating mild hypertension is likely beneficial. A limitation is that most participants were white men, so the results may not apply to everyone.",
      pt: "Contexto: o melhor tratamento para hipertensão leve em idosos não está claro. Métodos: neste ensaio randomizado, 1.200 pacientes foram designados para um remédio novo ou para placebo. O desfecho primário foi AVC após três anos. Resultados: houve AVC em 3% do grupo do remédio e em 5% do grupo placebo; a diferença foi estatisticamente significativa. Os eventos adversos foram parecidos nos dois grupos. Conclusões: esses achados sugerem que tratar a hipertensão leve provavelmente traz benefício. Uma limitação é que a maioria dos participantes era de homens brancos, então os resultados podem não valer para todos.",
      questions: [
        { q: "What was the primary outcome?", options: ["Death", "Heart attack", "Adverse events", "Stroke"], a: 3 },
        { q: "What is a limitation of the study?", options: ["There was no placebo", "The participants were not diverse", "It was not randomized", "The difference was not significant"], a: 1 },
        { q: "What do the authors conclude?", options: ["Treating mild hypertension is likely beneficial", "The drug is dangerous", "The placebo works better", "Nothing can be concluded"], a: 0 }
      ]
    }
  },
  {
    id: "difficult", section: "s5", icon: "🤝", title: "Comunicação difícil", en: "Difficult conversations",
    words: [
      W("Breaking bad news", "Dar más notícias", "Brêi-kin béd niúz", "Telling a patient or a family serious, unwanted information.", "SPIKES is a protocol for breaking bad news.", "SPIKES é um protocolo para dar más notícias."),
      W("Informed consent", "Consentimento informado", "In-fórmd kãn-sént", "Permission given after understanding the risks and benefits.", "We need your informed consent before the surgery.", "Precisamos do seu consentimento informado antes da cirurgia."),
      W("I'm afraid", "Infelizmente (receio que)", "Áim a-frêid", "A polite way to introduce bad news.", "I'm afraid the results are not what we hoped.", "Infelizmente, os resultados não são o que esperávamos."),
      W("Prognosis", "Prognóstico", "Prog-nôu-sis", "The likely course or outcome of a disease.", "With treatment, the prognosis is good.", "Com tratamento, o prognóstico é bom."),
      W("Side effects", "Efeitos colaterais", "Sáid i-fékts", "Unwanted effects of a medicine.", "Common side effects include nausea and fatigue.", "Efeitos colaterais comuns incluem náusea e cansaço."),
      W("Reassure", "Tranquilizar", "Ri-a-shúr", "To make someone feel less worried.", "The doctor tried to reassure the mother.", "O médico tentou tranquilizar a mãe."),
      W("Concerns", "Preocupações", "Kãn-sãrnz", "Things that worry a person.", "Do you have any concerns about the treatment?", "Você tem alguma preocupação com o tratamento?"),
      W("Empathy", "Empatia", "Ém-pa-thi", "The ability to understand how another person feels.", "Showing empathy improves patient trust.", "Mostrar empatia aumenta a confiança do paciente."),
      W("Palliative care", "Cuidados paliativos", "Pé-li-a-tiv kér", "Care that relieves symptoms and improves quality of life in serious illness.", "She was referred to palliative care for pain control.", "Ela foi encaminhada aos cuidados paliativos para controle da dor."),
      W("Advance directive", "Diretiva antecipada de vontade", "Ad-véns di-rék-tiv", "A legal document with a patient's wishes for future care.", "His advance directive states that he does not want intubation.", "A diretiva antecipada dele diz que ele não quer ser intubado."),
      W("Next of kin", "Parente mais próximo", "Nékst óv kin", "A person's closest living relative.", "We called his next of kin after the accident.", "Ligamos para o parente mais próximo dele após o acidente."),
      W("Decision-making capacity", "Capacidade de decisão", "Di-sí-jãn mêi-kin ka-pé-si-ti", "The ability to understand information and make a choice about care.", "She has decision-making capacity, so she can refuse treatment.", "Ela tem capacidade de decisão, então pode recusar o tratamento."),
      W("Disclose", "Revelar", "Dis-klôuz", "To make information known.", "Physicians should disclose medical errors to patients.", "Médicos devem revelar erros médicos aos pacientes."),
      W("Shared decision", "Decisão compartilhada", "Shérd di-sí-jãn", "A choice made together by the patient and the doctor.", "Cancer screening at this age is a shared decision.", "O rastreamento de câncer nessa idade é uma decisão compartilhada.")
    ],
    reading: {
      title: "A difficult conversation",
      text: "Dr. Costa sits down with Mrs. Allen and asks what she already knows about her tests. Then she says, \"I'm afraid the biopsy shows cancer.\" She pauses and gives Mrs. Allen time. Mrs. Allen cries and asks about her prognosis. Dr. Costa shows empathy, answers honestly, and explains the treatment options and their side effects. Together they make a shared decision to start chemotherapy. Before leaving, Dr. Costa asks, \"Do you have any other concerns?\" and schedules a follow-up visit.",
      pt: "A Dra. Costa se senta com a Sra. Allen e pergunta o que ela já sabe sobre os exames. Depois diz: \"Infelizmente, a biópsia mostra câncer.\" Ela faz uma pausa e dá tempo à Sra. Allen. A Sra. Allen chora e pergunta sobre o prognóstico. A Dra. Costa mostra empatia, responde com honestidade e explica as opções de tratamento e seus efeitos colaterais. Juntas, elas decidem começar a quimioterapia. Antes de sair, a Dra. Costa pergunta: \"A senhora tem alguma outra preocupação?\" e marca um retorno.",
      questions: [
        { q: "What does Dr. Costa do first?", options: ["She prescribes chemotherapy", "She calls the next of kin", "She asks what the patient already knows", "She gives the diagnosis right away"], a: 2 },
        { q: "How is the treatment chosen?", options: ["By a shared decision", "By the hospital director", "By the family alone", "By chance"], a: 0 },
        { q: "What does Dr. Costa ask before leaving?", options: ["If the patient wants to go home", "If the patient has any other concerns", "If the patient has insurance", "If the patient can drive"], a: 1 }
      ]
    }
  },
  {
    id: "vignettes", section: "s5", icon: "🏆", title: "A linguagem do USMLE", en: "USMLE question language",
    words: [
      W("Which of the following", "Qual das alternativas a seguir", "Uítch óv dã fó-lou-in", "The usual start of a multiple-choice question.", "Which of the following is the best treatment?", "Qual das alternativas a seguir é o melhor tratamento?"),
      W("Most likely", "Mais provável", "Môust láik-li", "The best single answer among the options.", "What is the most likely diagnosis?", "Qual é o diagnóstico mais provável?"),
      W("Next best step", "Próximo passo mais adequado", "Nékst bést stép", "The most appropriate action to take now.", "What is the next best step in management?", "Qual é o próximo passo mais adequado na conduta?"),
      W("Presents with", "Apresenta-se com", "Pri-zénts uíd", "Comes to medical care showing certain symptoms.", "A 30-year-old woman presents with fatigue and weight gain.", "Uma mulher de 30 anos apresenta-se com cansaço e ganho de peso."),
      W("Mechanism of action", "Mecanismo de ação", "Mé-ka-ni-zãm óv ék-shãn", "How a drug produces its effect.", "What is the mechanism of action of this drug?", "Qual é o mecanismo de ação deste remédio?"),
      W("Within normal limits", "Dentro dos limites normais", "Uí-dín nór-mal lí-mits", "Normal for a test or a measurement.", "Her vital signs are within normal limits.", "Os sinais vitais dela estão dentro dos limites normais."),
      W("Biopsy specimen", "Amostra de biópsia", "Bái-óp-si spé-si-men", "A piece of tissue removed for examination.", "A biopsy specimen shows noncaseating granulomas.", "Uma amostra de biópsia mostra granulomas não caseosos."),
      W("Is associated with", "Está associado(a) a", "Iz a-sôu-shi-ei-tid uíd", "Occurs together with; is linked to.", "This condition is associated with HLA-B27.", "Essa doença está associada ao HLA-B27."),
      W("Increased risk", "Risco aumentado", "In-kríst rísk", "A higher chance of developing something.", "This patient is at increased risk of osteoporosis.", "Este paciente tem risco aumentado de osteoporose."),
      W("Deficiency", "Deficiência", "Di-fí-shen-si", "A lack of a substance or an enzyme.", "Which enzyme deficiency explains these findings?", "Qual deficiência enzimática explica esses achados?"),
      W("Administration", "Administração", "Ad-mi-nis-trêi-shãn", "The act of giving a drug.", "Symptoms improved after administration of glucagon.", "Os sintomas melhoraram após a administração de glucagon."),
      W("Exposure", "Exposição", "Ex-pôu-jãr", "Contact with something that may cause disease.", "He has a history of asbestos exposure.", "Ele tem história de exposição ao amianto."),
      W("Contraindicated", "Contraindicado(a)", "Kon-tra-ín-di-kei-tid", "Should not be used in a specific situation.", "This drug is contraindicated in pregnancy.", "Este remédio é contraindicado na gravidez."),
      W("Laboratory studies", "Exames laboratoriais", "Lé-bro-tó-ri stâ-diz", "Blood and other tests done in a lab.", "Laboratory studies show a low sodium level.", "Os exames laboratoriais mostram sódio baixo."),
      W("Etiology", "Etiologia (causa)", "I-ti-ó-lo-dji", "The cause of a disease.", "What is the most common etiology of this condition?", "Qual é a etiologia mais comum dessa doença?")
    ],
    reading: {
      title: "A typical vignette",
      text: "A 25-year-old woman presents with fatigue, joint pain, and a rash on her cheeks that gets worse with sun exposure. Her vital signs are within normal limits. Laboratory studies show anemia and protein in the urine. Antinuclear antibodies are positive. Which of the following antibodies is most specific for her most likely diagnosis? The answer is anti-double-stranded DNA (or anti-Smith). Her condition, systemic lupus erythematosus, is associated with an increased risk of kidney disease.",
      pt: "Uma mulher de 25 anos apresenta-se com cansaço, dor nas articulações e manchas vermelhas nas bochechas que pioram com o sol. Os sinais vitais estão dentro dos limites normais. Os exames laboratoriais mostram anemia e proteína na urina. O FAN é positivo. Qual dos anticorpos a seguir é mais específico para o diagnóstico mais provável? A resposta é o anti-DNA dupla-hélice (ou anti-Sm). A doença dela, lúpus eritematoso sistêmico, está associada a risco aumentado de doença renal.",
      questions: [
        { q: "What makes her rash worse?", options: ["Cold weather", "Exercise", "Sun exposure", "Certain foods"], a: 2 },
        { q: "What do her laboratory studies show?", options: ["Anemia and protein in the urine", "High blood sugar", "Normal results", "Low potassium"], a: 0 },
        { q: "What is her most likely diagnosis?", options: ["Rheumatoid arthritis", "Systemic lupus erythematosus", "Psoriasis", "Diabetes"], a: 1 }
      ]
    }
  }
);
