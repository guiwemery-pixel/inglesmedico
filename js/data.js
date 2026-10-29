/* Conteúdo da plataforma Inglês Médico.
 * W(inglês, português, pronúncia aproximada, definição simples em inglês, frase de exemplo)
 * A frase de exemplo sempre contém o termo em inglês: ela é usada nos exercícios
 * de completar lacunas e de montar frases.
 */
function W(en, pt, pr, def, ex) { return { en, pt, pr, def, ex }; }

const SECTIONS = [
  { id: "s1", title: "Fundamentos", level: "A1–A2", desc: "Hospital, corpo humano e anatomia da cabeça e do esqueleto." },
  { id: "s2", title: "Na prática clínica", level: "B1", desc: "Sintomas, anamnese, exame físico, terminologia e radiografia." },
  { id: "s3", title: "Sistemas do corpo", level: "B1–B2", desc: "Cardiovascular, respiratório, digestivo, neurológico e urinário." },
  { id: "s4", title: "Plantão", level: "B2", desc: "Medicamentos, emergência, exames, abreviações e falsos cognatos." }
];

const UNITS = [
  /* ---------------- SEÇÃO 1 ---------------- */
  {
    id: "hospital", section: "s1", title: "Hospital e equipe", en: "The hospital and the team",
    words: [
      W("Hospital", "Hospital", "Rós-pi-ral", "A place where sick or injured people receive medical care.", "The patient was taken to the hospital by ambulance."),
      W("Ward", "Enfermaria", "Uórd", "A room or area in a hospital with beds for patients.", "She is in the cardiology ward on the third floor."),
      W("Physician", "Médico(a)", "Fi-zí-shãn", "A doctor of medicine.", "The physician asked about the pain."),
      W("Nurse", "Enfermeiro(a)", "Nãrs", "A person trained to care for sick people, usually in a hospital.", "The nurse checked his blood pressure."),
      W("Resident", "Residente", "Ré-zi-dent", "A doctor in specialty training after medical school.", "The resident examined the patient first."),
      W("Intern", "Interno / médico do 1º ano", "Ín-tãrn", "A medical graduate in the first year of hospital training.", "The intern wrote the admission notes."),
      W("Surgeon", "Cirurgião", "Sãr-djãn", "A doctor who performs operations.", "The surgeon will operate tomorrow morning."),
      W("Emergency room", "Pronto-socorro", "I-mãr-djen-si rúm", "The hospital department for urgent care. Also called ER or A&E (UK).", "He went to the emergency room with chest pain."),
      W("Operating room", "Centro cirúrgico", "Ó-pe-rei-rin rúm", "The room where surgery is done. Also called OR or theatre (UK).", "The operating room is ready for the next case."),
      W("Intensive care unit", "UTI", "In-tén-siv kér iú-nit", "A hospital unit for very sick patients who need constant monitoring (ICU).", "After the surgery, she stayed two days in the intensive care unit."),
      W("Outpatient clinic", "Ambulatório", "Áut-pei-shent klí-nik", "A place where patients are seen without staying overnight.", "Come back to the outpatient clinic in two weeks."),
      W("Admission", "Internação / admissão", "Ad-mí-shãn", "When a patient enters the hospital to stay.", "The doctor recommended admission for observation."),
      W("Discharge", "Alta hospitalar", "Dís-tchardj", "When a patient leaves the hospital after treatment.", "His discharge is planned for Friday."),
      W("Pharmacist", "Farmacêutico(a)", "Fár-ma-sist", "A person trained to prepare and give out medicines.", "The pharmacist explained the dose."),
      W("Stretcher", "Maca", "Strét-chãr", "A flat frame used to carry a sick or injured person.", "They put the patient on a stretcher."),
      W("Appointment", "Consulta (horário marcado)", "A-póint-ment", "A planned time to see a doctor.", "I have an appointment with the dermatologist on Monday.")
    ],
    reading: {
      title: "A day in the hospital",
      text: "Dr. Silva is a resident in internal medicine. Every morning she visits the patients on her ward with the nurse. First, they check the new admissions from the emergency room. Then they discuss each case with the attending physician. In the afternoon, Dr. Silva works in the outpatient clinic, where patients come for their appointments. Before going home, she writes the discharge summaries for the patients who are leaving the hospital.",
      pt: "A Dra. Silva é residente de clínica médica. Toda manhã ela visita os pacientes da sua enfermaria com a enfermeira. Primeiro, eles verificam as novas internações vindas do pronto-socorro. Depois discutem cada caso com o médico assistente (preceptor). À tarde, a Dra. Silva atende no ambulatório, onde os pacientes vêm para suas consultas. Antes de ir para casa, ela escreve os resumos de alta dos pacientes que estão deixando o hospital.",
      questions: [
        { q: "What is Dr. Silva?", options: ["A nurse", "A resident", "A surgeon", "A pharmacist"], a: 1 },
        { q: "Where do the new admissions come from?", options: ["The outpatient clinic", "The operating room", "The emergency room", "The pharmacy"], a: 2 },
        { q: "What does she do before going home?", options: ["She writes discharge summaries", "She operates", "She visits the ICU", "She calls the pharmacist"], a: 0 }
      ]
    }
  },
  {
    id: "body", section: "s1", title: "O corpo humano", en: "The human body",
    words: [
      W("Head", "Cabeça", "Réd", "The top part of the body, with the brain, eyes, ears, nose and mouth.", "She hit her head on the door."),
      W("Neck", "Pescoço", "Nék", "The part of the body between the head and the shoulders.", "He has a stiff neck."),
      W("Chest", "Tórax / peito", "Tchést", "The front part of the body between the neck and the abdomen.", "The chest X-ray is normal."),
      W("Abdomen", "Abdome", "Áb-do-men", "The part of the body that contains the stomach and intestines; the belly.", "Her abdomen is soft and not tender."),
      W("Back", "Costas", "Bék", "The rear part of the body from the neck to the hips.", "He has pain in his lower back."),
      W("Shoulder", "Ombro", "Shôul-dãr", "The joint between the arm and the body.", "She fell and dislocated her shoulder."),
      W("Elbow", "Cotovelo", "Él-bou", "The joint in the middle of the arm.", "Bend your elbow, please."),
      W("Wrist", "Punho", "Rist", "The joint between the hand and the arm.", "The nurse took the pulse at the wrist."),
      W("Hip", "Quadril", "Ríp", "The joint between the leg and the pelvis.", "Elderly patients often fracture the hip."),
      W("Knee", "Joelho", "Níi", "The joint in the middle of the leg.", "Her knee is swollen after the fall."),
      W("Ankle", "Tornozelo", "Én-kãl", "The joint between the foot and the leg.", "He twisted his ankle playing football."),
      W("Thigh", "Coxa", "Tháai", "The upper part of the leg, above the knee.", "The injection was given in the thigh."),
      W("Calf", "Panturrilha", "Kéf", "The back part of the leg, below the knee.", "She has pain and swelling in her left calf."),
      W("Skin", "Pele", "Skín", "The outer covering of the body.", "The skin is warm and dry."),
      W("Heel", "Calcanhar", "Ríil", "The back part of the foot.", "Diabetic patients should check their heel for wounds."),
      W("Groin", "Virilha", "Gróin", "The area where the legs join the abdomen.", "There is a small lump in the right groin.")
    ],
    reading: {
      title: "Body parts at the clinic",
      text: "Mr. Jones is 60 years old. He comes to the clinic because his right knee hurts when he walks. He also has some pain in his lower back. The doctor examines his knee, his hip and his ankle. The knee is a little swollen, but the skin is normal. The doctor asks him to bend and straighten his leg. She explains that exercise can help the muscles of the thigh and the calf protect the joint.",
      pt: "O Sr. Jones tem 60 anos. Ele vem ao ambulatório porque seu joelho direito dói quando ele caminha. Ele também tem um pouco de dor na região lombar. A médica examina o joelho, o quadril e o tornozelo. O joelho está um pouco inchado, mas a pele está normal. Ela pede para ele dobrar e esticar a perna. Explica que exercícios podem ajudar os músculos da coxa e da panturrilha a proteger a articulação.",
      questions: [
        { q: "Why does Mr. Jones come to the clinic?", options: ["His shoulder hurts", "His right knee hurts", "He has a headache", "He has a skin rash"], a: 1 },
        { q: "How is the skin of the knee?", options: ["Red", "Hot", "Normal", "Broken"], a: 2 },
        { q: "What can help protect the joint?", options: ["Rest only", "Surgery", "Exercise", "Ice cream"], a: 2 }
      ]
    }
  },
  {
    id: "head", section: "s1", title: "Cabeça: crânio e face", en: "Head: skull and face", source: "Material base: The Human Body – Head",
    words: [
      W("Skull", "Crânio", "SkóLL", "All the bones of the head, including the cranium and the face.", "The skull protects the brain."),
      W("Face", "Face / rosto", "Fêiss", "The front of the head, with the eyes, nose and mouth.", "The facial skeleton supports the soft tissues of the face."),
      W("Frontal bone", "Osso frontal", "Frôn-tal Boun", "The bone of the forehead.", "The frontal bone forms the forehead."),
      W("Parietal bone", "Osso parietal", "Pã-rái-e-tal Boun", "One of the two bones forming the top and sides of the cranium.", "There are two parietal bones, one on each side."),
      W("Occipital bone", "Osso occipital", "Ók-sí-pi-tal Boun", "The bone at the back and base of the cranium.", "The occipital bone is at the back of the head."),
      W("Temporal bone", "Osso temporal", "Têm-po-ral Boun", "One of the two bones at the sides of the cranium, around the ear.", "The temporal bone contains the middle ear."),
      W("Sphenoid", "Esfenoide", "Is-FÍ-nóid", "A butterfly-shaped bone at the base of the cranium.", "The sphenoid is a single bone at the base of the skull."),
      W("Ethmoid", "Etmoide", "Éth-móid", "A light bone between the eyes that forms part of the nasal cavity.", "The ethmoid is a light bone between the orbits."),
      W("Zygomatic", "Zigomático", "Zái-gô-má-rik", "The cheek bone.", "The zygomatic bone forms the cheek."),
      W("Lacrimal", "Lacrimal", "Lá-crí-môL", "The smallest bones of the face, in the medial wall of the orbit.", "The lacrimal bones are the smallest bones of the face."),
      W("Maxilla", "Maxila", "Mék-sí-la", "The bone of the upper jaw.", "The maxilla forms part of the hard palate."),
      W("Mandible", "Mandíbula", "Mên-dí-bôu", "The lower jaw bone.", "The mandible articulates with the skull at the TMJ."),
      W("Vomer", "Vômer", "Vôu-mãr", "A thin bone that forms the back part of the nasal septum.", "The vomer forms part of the nasal septum."),
      W("Palatine", "Palatino", "Pé-la-tain", "A bone at the back of the oral cavity, part of the hard palate.", "The palatine bone is at the rear of the oral cavity."),
      W("Inferior nasal concha", "Concha nasal inferior", "In-fí-ri-ãr Nêi-zal Kón-ka", "A curved bone inside the nasal cavity that increases its surface area.", "Each inferior nasal concha increases the surface of the nasal cavity."),
      W("Jaw", "Mandíbula / maxilar (popular)", "Djó", "The upper or lower bone of the mouth (common word).", "Open your jaw slowly, please.")
    ],
    reading: {
      title: "Face and skull",
      text: "The facial skeleton supports the soft tissues of the face. It consists of 14 bones, which house the orbits of the eyes, the nasal and oral cavities, and the sinuses. The zygomatic bones form the cheeks. The lacrimal bones are the smallest bones of the face. The maxilla is part of the upper jaw and the hard palate, and the mandible articulates with the base of the cranium at the temporomandibular joint (TMJ). The cranium is formed by the frontal, parietal, occipital, temporal, sphenoid and ethmoid bones.",
      pt: "O esqueleto facial sustenta os tecidos moles da face. É composto por 14 ossos, que alojam as órbitas, as cavidades nasal e oral e os seios da face. Os ossos zigomáticos formam as bochechas. Os ossos lacrimais são os menores da face. A maxila faz parte da mandíbula superior e do palato duro, e a mandíbula se articula com a base do crânio na articulação temporomandibular (ATM). O crânio é formado pelos ossos frontal, parietal, occipital, temporal, esfenoide e etmoide.",
      questions: [
        { q: "How many bones form the facial skeleton?", options: ["8", "14", "22", "80"], a: 1 },
        { q: "Which bones are the smallest of the face?", options: ["The zygomatic bones", "The nasal bones", "The lacrimal bones", "The palatine bones"], a: 2 },
        { q: "Where does the mandible articulate with the cranium?", options: ["At the TMJ", "At the orbit", "At the nasal septum", "At the hard palate"], a: 0 }
      ]
    }
  },
  {
    id: "axial", section: "s1", title: "Esqueleto axial", en: "Axial skeleton", source: "Material base: Axial Skeleton",
    words: [
      W("Axial skeleton", "Esqueleto axial", "Ák-si-al Ské-le-ton", "The central axis of the body: skull, vertebral column and thoracic cage (80 bones).", "The axial skeleton is composed of 80 bones."),
      W("Appendicular skeleton", "Esqueleto apendicular", "A-pen-dí-kiu-lar Ské-le-ton", "The bones of the limbs and the girdles that attach them.", "The arms and legs belong to the appendicular skeleton."),
      W("Vertebral column", "Coluna vertebral", "Vãr-te-bral Kó-lum", "The column of vertebrae that protects the spinal cord; the spine.", "The vertebral column extends from the skull to the pelvis."),
      W("Spinal cord", "Medula espinhal", "Spái-nal Kórd", "The bundle of nerves inside the vertebral column.", "The vertebral column protects the spinal cord."),
      W("Vertebra", "Vértebra", "Vãr-te-bra", "One of the bones of the spine (plural: vertebrae).", "Each vertebra has a large hole for the spinal cord."),
      W("Sacrum", "Sacro", "Sêi-krum", "A triangular bone formed by fused vertebrae at the base of the spine.", "The sacrum connects the spine to the pelvis."),
      W("Coccyx", "Cóccix", "Kók-siks", "The small tail bone at the end of the spine.", "She fell and injured her coccyx."),
      W("Intervertebral disc", "Disco intervertebral", "In-tãr-vãr-te-bral Dísk", "A cushion of fibrous cartilage between two vertebrae.", "An intervertebral disc absorbs shocks from walking and running."),
      W("Atlas", "Atlas", "Ét-las", "The first cervical vertebra (C1), which supports the head.", "The atlas is the first cervical vertebra."),
      W("Axis", "Áxis", "Ék-sis", "The second cervical vertebra (C2).", "The axis allows the head to rotate."),
      W("Rib cage", "Caixa torácica", "Ríb Kêidj", "The ribs and sternum, which protect the heart and lungs.", "The rib cage protects the heart and lungs."),
      W("Sternum", "Esterno", "Stãr-num", "The flat bone in the front of the chest; the breastbone.", "The ribs join the sternum anteriorly."),
      W("Xiphoid process", "Processo xifoide", "Zái-fóid Pró-sés", "The small lower end of the sternum.", "Do not compress the xiphoid process during CPR."),
      W("Floating ribs", "Costelas flutuantes", "Flôu-rin Ríbs", "Rib pairs 11 and 12, which do not reach the sternum.", "The floating ribs do not reach the front of the body."),
      W("Cartilage", "Cartilagem", "Kár-ti-lidj", "Strong flexible tissue found in joints and between bones.", "Each disc is made of fibrous cartilage."),
      W("Cushion", "Amortecedor / almofada", "Kú-shãn", "Something soft that absorbs shocks.", "The disc acts as a cushion between the vertebrae.")
    ],
    reading: {
      title: "The vertebral column and the thoracic cage",
      text: "The vertebral column surrounds and protects the spinal cord, supports the head, and is an attachment point for the ribs and the muscles of the back and neck. It has 24 vertebrae plus the sacrum and the coccyx. The regions are cervical (7 vertebrae), thoracic (12), lumbar (5), sacral and coccygeal. Intervertebral discs lie between the vertebral bodies and act as cushions. The thoracic cage has the 12 pairs of ribs and the sternum. Ribs 1 to 7 are true ribs; ribs 8 to 12 are false ribs, and pairs 11 and 12 are floating ribs.",
      pt: "A coluna vertebral envolve e protege a medula espinhal, sustenta a cabeça e é ponto de fixação para as costelas e os músculos das costas e do pescoço. Possui 24 vértebras, além do sacro e do cóccix. As regiões são cervical (7 vértebras), torácica (12), lombar (5), sacral e coccígea. Os discos intervertebrais ficam entre os corpos vertebrais e funcionam como amortecedores. A caixa torácica tem 12 pares de costelas e o esterno. As costelas 1 a 7 são verdadeiras; 8 a 12 são falsas, e os pares 11 e 12 são flutuantes.",
      questions: [
        { q: "How many cervical vertebrae are there?", options: ["5", "7", "12", "24"], a: 1 },
        { q: "What do intervertebral discs do?", options: ["They produce blood", "They act as cushions", "They connect ribs to the sternum", "They protect the brain"], a: 1 },
        { q: "Which ribs are 'floating ribs'?", options: ["Pairs 1 and 2", "Pairs 1 to 7", "Pairs 8 to 10", "Pairs 11 and 12"], a: 3 }
      ]
    }
  },
  {
    id: "facial", section: "s1", title: "Músculos da face", en: "Facial muscles", source: "Material base: Facial Muscles",
    words: [
      W("Facial nerve", "Nervo facial", "Fêi-shal Nãrv", "Cranial nerve VII; it supplies all the muscles of facial expression.", "All the muscles of facial expression are innervated by the facial nerve."),
      W("Frontalis", "Músculo frontal", "Frôn-tá-lis", "The muscle of the forehead that raises the eyebrows.", "The frontalis raises the eyebrows."),
      W("Orbicularis oculi", "Orbicular do olho", "Ór-bi-kiu-lé-ris Ó-kiu-lai", "The muscle around the eye that closes the eyelids.", "Ask the patient to close the eyes tightly to test the orbicularis oculi."),
      W("Orbicularis oris", "Orbicular da boca", "Ór-bi-kiu-lé-ris Ó-ris", "The muscle around the mouth that closes and purses the lips.", "The orbicularis oris closes the lips."),
      W("Procerus", "Prócero", "Prôu-sí-rãs", "A small muscle between the eyebrows that wrinkles the skin of the nose.", "The procerus pulls the eyebrows down when we frown."),
      W("Nasalis", "Músculo nasal", "Nei-zé-lis", "The muscle of the nose that compresses or opens the nostrils.", "The nasalis belongs to the nasal group."),
      W("Buccinator", "Bucinador", "Bák-si-nei-rãr", "The muscle of the cheek that keeps food between the teeth.", "The buccinator helps us blow and chew."),
      W("Zygomaticus major", "Zigomático maior", "Zái-gou-mé-ri-kãs Mêi-djãr", "The muscle that pulls the corner of the mouth up when we smile.", "The zygomaticus major is the main smiling muscle."),
      W("Risorius", "Risório", "Ri-zó-ri-ãs", "A muscle that pulls the corners of the mouth to the side.", "The risorius pulls the corners of the mouth laterally."),
      W("Mentalis", "Mentual", "Mên-té-lis", "The muscle of the chin that pushes up the lower lip.", "The mentalis wrinkles the skin of the chin."),
      W("Masseter", "Masseter", "Mé-si-tãr", "A strong muscle of mastication that closes the jaw.", "The masseter is a muscle of mastication, not of facial expression."),
      W("Platysma", "Platisma", "Plá-tíz-ma", "A thin muscle in the neck that pulls the corners of the mouth down.", "The platysma is a thin sheet of muscle in the neck."),
      W("Sternocleidomastoid", "Esternocleidomastóideo", "Stãr-no-klái-do-més-tóid", "A large neck muscle that turns and bends the head.", "The sternocleidomastoid turns the head to the opposite side."),
      W("Subcutaneous tissue", "Tecido subcutâneo", "Sab-kiu-têi-ni-ãs Tí-shu", "The layer under the skin.", "The facial muscles lie in the subcutaneous tissue."),
      W("Frown", "Franzir a testa", "Fráun", "To make lines on the forehead when angry or worried.", "Please frown for me."),
      W("Smile", "Sorrir / sorriso", "Smáil", "To turn up the corners of the mouth when happy.", "Can you smile and show your teeth?")
    ],
    reading: {
      title: "The muscles of facial expression",
      text: "The muscles of facial expression are located in the subcutaneous tissue. They originate from bone or fascia and insert onto the skin. When they contract, they pull on the skin. They are the only group of muscles that insert into skin. They come from the second pharyngeal arch, so they are all innervated by the facial nerve. They can be divided into three groups: orbital, nasal and oral. To test the facial nerve, the doctor asks the patient to raise the eyebrows, close the eyes tightly, smile and puff out the cheeks.",
      pt: "Os músculos da expressão facial estão no tecido subcutâneo. Originam-se de osso ou fáscia e se inserem na pele. Ao contrair, puxam a pele. São o único grupo de músculos que se insere na pele. Vêm do segundo arco faríngeo e, por isso, todos são inervados pelo nervo facial. Dividem-se em três grupos: orbital, nasal e oral. Para testar o nervo facial, o médico pede ao paciente que levante as sobrancelhas, feche os olhos com força, sorria e encha as bochechas.",
      questions: [
        { q: "Where do the facial muscles insert?", options: ["Into bone", "Into the skin", "Into cartilage", "Into the tongue"], a: 1 },
        { q: "Which nerve supplies these muscles?", options: ["The trigeminal nerve", "The vagus nerve", "The facial nerve", "The optic nerve"], a: 2 },
        { q: "What are the three groups?", options: ["Orbital, nasal and oral", "Upper, middle and lower", "Deep, middle and superficial", "Frontal, parietal and occipital"], a: 0 }
      ]
    }
  },

  /* ---------------- SEÇÃO 2 ---------------- */
  {
    id: "symptoms", section: "s2", title: "Sinais e sintomas", en: "Signs and symptoms",
    words: [
      W("Pain", "Dor", "Pêin", "An unpleasant feeling caused by illness or injury.", "Where is the pain?"),
      W("Fever", "Febre", "Fí-vãr", "A body temperature higher than normal.", "The child has had a fever for two days."),
      W("Cough", "Tosse", "Kóf", "To push air out of the lungs suddenly and noisily.", "He has a dry cough at night."),
      W("Shortness of breath", "Falta de ar / dispneia", "Shórt-nes óv Bréth", "Difficulty breathing (dyspnea).", "She complains of shortness of breath when climbing stairs."),
      W("Headache", "Dor de cabeça / cefaleia", "Ré-dêik", "A pain in the head.", "Do you often have a headache in the morning?"),
      W("Nausea", "Náusea / enjoo", "Nó-zi-a", "The feeling that you are going to vomit.", "The medication may cause nausea."),
      W("Vomiting", "Vômito", "Vó-mi-rin", "Throwing up the contents of the stomach through the mouth.", "He has been vomiting since last night."),
      W("Dizziness", "Tontura", "Dí-zi-nés", "Feeling that you are going to fall or that things are spinning.", "The patient reports dizziness when standing up."),
      W("Fatigue", "Cansaço / fadiga", "Fa-tíig", "Extreme tiredness.", "Fatigue is a common symptom of anemia."),
      W("Rash", "Erupção cutânea / manchas", "Résh", "An area of red spots on the skin.", "The child has a rash on the chest."),
      W("Swelling", "Inchaço / edema", "Suél-in", "An abnormal increase in the size of a body part.", "There is swelling in both ankles."),
      W("Itching", "Coceira / prurido", "Ít-chin", "A feeling on the skin that makes you want to scratch.", "The rash causes intense itching."),
      W("Chills", "Calafrios", "Tchíls", "A feeling of cold with shaking, often with fever.", "She had fever and chills last night."),
      W("Weight loss", "Perda de peso", "Uêit Lós", "Becoming lighter; losing body weight.", "Unintentional weight loss needs investigation."),
      W("Sore throat", "Dor de garganta", "Sór Thrôut", "Pain in the throat, especially when swallowing.", "He has a sore throat and a fever."),
      W("Bruise", "Hematoma / mancha roxa", "Brúz", "A blue or purple mark on the skin after an injury.", "There is a large bruise on her arm.")
    ],
    reading: {
      title: "A patient with the flu",
      text: "Maria is 25 years old. Yesterday she started to feel sick. She has a fever, chills and a headache. She also has a sore throat and a dry cough. She feels a lot of fatigue and does not want to eat. She has no rash and no shortness of breath. The doctor thinks it is probably influenza. He recommends rest, fluids and paracetamol for the fever, and explains the warning signs: difficulty breathing, chest pain or confusion.",
      pt: "Maria tem 25 anos. Ontem ela começou a se sentir mal. Tem febre, calafrios e dor de cabeça. Também tem dor de garganta e tosse seca. Sente muito cansaço e não quer comer. Não tem manchas na pele nem falta de ar. O médico acha que provavelmente é gripe (influenza). Recomenda repouso, líquidos e paracetamol para a febre, e explica os sinais de alarme: dificuldade para respirar, dor no peito ou confusão.",
      questions: [
        { q: "What type of cough does Maria have?", options: ["A productive cough", "A dry cough", "No cough", "A cough with blood"], a: 1 },
        { q: "Which symptom does she NOT have?", options: ["Fever", "Headache", "Shortness of breath", "Fatigue"], a: 2 },
        { q: "Which is a warning sign?", options: ["Difficulty breathing", "A mild headache", "Feeling tired", "Not wanting to eat"], a: 0 }
      ]
    }
  },
  {
    id: "history", section: "s2", title: "Anamnese: perguntas", en: "Taking a history",
    words: [
      W("Chief complaint", "Queixa principal", "Tchíif Kom-plêint", "The main reason why the patient came to the doctor.", "What is the chief complaint?"),
      W("What brings you here today?", "O que te traz aqui hoje?", "Uót brings iú ríar tu-dêi", "A polite way to start the consultation.", "Good morning. What brings you here today?"),
      W("When did it start?", "Quando começou?", "Uén did it stárt", "A question about the onset of the symptom.", "When did it start? Yesterday or last week?"),
      W("Where does it hurt?", "Onde dói?", "Uér dãz it rãrt", "A question about the location of the pain.", "Where does it hurt? Can you point to it?"),
      W("On a scale of 1 to 10", "Numa escala de 1 a 10", "On a skêil óv uãn tu tén", "Used to ask how strong the pain is.", "On a scale of 1 to 10, how bad is the pain?"),
      W("Does it radiate?", "Irradia?", "Dãz it rêi-di-eit", "A question: does the pain spread to another place?", "Does it radiate? To your arm or to your jaw?"),
      W("Allergies", "Alergias", "É-lãr-djiz", "Bad reactions of the body to medicines, foods or other things.", "Do you have any allergies to medicines?"),
      W("Medical history", "Antecedentes pessoais / história médica", "Mé-di-kal Rís-to-ri", "The patient's past illnesses, surgeries and treatments.", "Tell me about your medical history."),
      W("Family history", "Antecedentes familiares", "Fé-mi-li Rís-to-ri", "Diseases that the patient's relatives have or had.", "Is there any family history of heart disease?"),
      W("Are you taking any medication?", "Você toma algum remédio?", "Ár iú têi-kin éni me-di-kêi-shãn", "A question about current medicines.", "Are you taking any medication? Even vitamins?"),
      W("Do you smoke?", "Você fuma?", "Du iú smôuk", "A question about tobacco use.", "Do you smoke? How many cigarettes a day?"),
      W("How often", "Com que frequência", "Ráu ó-fen", "Used to ask about frequency.", "How often do you drink alcohol?"),
      W("Onset", "Início (do sintoma)", "Ón-set", "The beginning of a symptom or disease.", "The onset of the pain was sudden."),
      W("Worse", "Pior", "Uãrs", "More bad; the comparative of bad.", "Is the pain worse at night?"),
      W("Better", "Melhor", "Bé-rãr", "More good; the comparative of good.", "Does anything make it better?"),
      W("Surgery", "Cirurgia", "Sãr-dje-ri", "A medical operation.", "Have you ever had surgery?")
    ],
    reading: {
      title: "Taking a pain history (SOCRATES)",
      text: "A useful way to ask about pain is SOCRATES: Site (Where does it hurt?), Onset (When did it start?), Character (What is it like? Sharp, dull, burning?), Radiation (Does it radiate?), Associations (Any other symptoms?), Time course (Is it constant or does it come and go?), Exacerbating and relieving factors (What makes it worse or better?) and Severity (On a scale of 1 to 10, how bad is it?). Always ask about allergies, medication, medical history and family history.",
      pt: "Uma forma útil de perguntar sobre a dor é o SOCRATES: Local (Onde dói?), Início (Quando começou?), Caráter (Como é? Pontada, surda, queimação?), Irradiação (Irradia?), Associações (Outros sintomas?), Evolução temporal (É constante ou vai e volta?), Fatores de piora e melhora (O que piora ou melhora?) e Intensidade (De 1 a 10, quão forte é?). Sempre pergunte sobre alergias, medicamentos, antecedentes pessoais e familiares.",
      questions: [
        { q: "In SOCRATES, what does 'O' mean?", options: ["Organ", "Onset", "Oxygen", "Operation"], a: 1 },
        { q: "Which question asks about severity?", options: ["Does it radiate?", "Where does it hurt?", "On a scale of 1 to 10, how bad is it?", "When did it start?"], a: 2 },
        { q: "'Dull' and 'sharp' describe the…", options: ["Character of the pain", "Site of the pain", "Family history", "Allergies"], a: 0 }
      ]
    }
  },
  {
    id: "exam", section: "s2", title: "Exame físico: comandos", en: "Physical examination",
    words: [
      W("Take a deep breath", "Respire fundo", "Têik a díip Bréth", "An instruction to breathe in fully.", "Take a deep breath and hold it."),
      W("Breathe out", "Solte o ar / expire", "Bríid áut", "An instruction to let the air out of the lungs.", "Now breathe out slowly."),
      W("Lie down", "Deite-se", "Lái dáun", "An instruction to lie on the bed.", "Please lie down on the couch."),
      W("Sit up", "Sente-se", "Sit áp", "An instruction to move from lying to sitting.", "Sit up for me, please."),
      W("Roll up your sleeve", "Arregace a manga", "Rôul áp iór slíiv", "An instruction to show the arm.", "Roll up your sleeve so I can check your blood pressure."),
      W("Follow my finger", "Siga meu dedo", "Fó-lou mai fín-gãr", "An instruction used to test eye movements.", "Keep your head still and follow my finger."),
      W("Stick out your tongue", "Coloque a língua para fora", "Stík áut iór Tãng", "An instruction to show the tongue.", "Open your mouth and stick out your tongue."),
      W("Squeeze my hand", "Aperte minha mão", "Skuíiz mai Rénd", "An instruction to test grip strength.", "Squeeze my hand as hard as you can."),
      W("Tenderness", "Dor à palpação", "Tén-dãr-nés", "Pain when an area is touched or pressed.", "There is tenderness in the right lower quadrant."),
      W("Stethoscope", "Estetoscópio", "Sté-tho-skôup", "An instrument used to listen to the heart and lungs.", "The doctor listened to his chest with a stethoscope."),
      W("Blood pressure", "Pressão arterial", "Blád Pré-shãr", "The force of the blood against the walls of the arteries.", "His blood pressure is 120 over 80."),
      W("Pulse", "Pulso", "Páls", "The beat of the heart felt in an artery.", "Her pulse is regular."),
      W("Auscultation", "Ausculta", "Ós-kãl-têi-shãn", "Listening to the sounds inside the body with a stethoscope.", "Auscultation of the lungs revealed crackles."),
      W("Palpation", "Palpação", "Pal-pêi-shãn", "Examining the body by touching it with the hands.", "Palpation of the abdomen was normal."),
      W("Reflexes", "Reflexos", "Rí-flék-siz", "Automatic movements in response to a stimulus.", "I am going to test your reflexes with this hammer."),
      W("Relax", "Relaxe", "Ri-léks", "An instruction to make the muscles loose.", "Try to relax your leg.")
    ],
    reading: {
      title: "Examining the chest",
      text: "The doctor washes her hands and introduces herself. She asks the patient to sit up and to take off his shirt. First she checks the pulse and the blood pressure. Then she uses the stethoscope for auscultation: 'Take a deep breath in through your mouth… and breathe out.' She listens to the front and the back of the chest. Finally she asks him to lie down to examine the abdomen. There is no tenderness on palpation. She thanks the patient and tells him he can get dressed.",
      pt: "A médica lava as mãos e se apresenta. Pede ao paciente para sentar e tirar a camisa. Primeiro verifica o pulso e a pressão arterial. Depois usa o estetoscópio para a ausculta: 'Respire fundo pela boca… e solte o ar.' Ela ausculta a parte anterior e posterior do tórax. Por fim, pede que ele se deite para examinar o abdome. Não há dor à palpação. Ela agradece ao paciente e diz que ele pode se vestir.",
      questions: [
        { q: "What does the doctor do first?", options: ["Auscultation", "Washes her hands and introduces herself", "Examines the abdomen", "Tests the reflexes"], a: 1 },
        { q: "What instrument is used for auscultation?", options: ["A hammer", "A thermometer", "A stethoscope", "A scalpel"], a: 2 },
        { q: "What did palpation of the abdomen show?", options: ["Tenderness", "No tenderness", "A mass", "Swelling"], a: 1 }
      ]
    }
  },
  {
    id: "terms", section: "s2", title: "Prefixos e sufixos", en: "Building medical words",
    words: [
      W("-itis", "-ite (inflamação)", "Ái-tis", "Suffix meaning inflammation. Example: appendicitis.", "Appendicitis is inflammation of the appendix: appendic + -itis."),
      W("-ectomy", "-ectomia (remoção cirúrgica)", "Ék-to-mi", "Suffix meaning surgical removal. Example: appendectomy.", "Removal of the gallbladder is a cholecyst-ectomy: -ectomy."),
      W("-ology", "-logia (estudo de)", "Ó-lo-dji", "Suffix meaning the study of. Example: cardiology.", "Cardiology is the study of the heart: cardi + -ology."),
      W("-algia", "-algia (dor)", "Él-dja", "Suffix meaning pain. Example: myalgia (muscle pain).", "Myalgia means muscle pain: my + -algia."),
      W("-scopy", "-scopia (exame visual)", "Skó-pi", "Suffix meaning looking inside with an instrument. Example: endoscopy.", "Colonoscopy uses a camera to look at the colon: -scopy."),
      W("-emia", "-emia (no sangue)", "Í-mi-a", "Suffix meaning a condition of the blood. Example: anemia.", "Hyperglycemia means high glucose in the blood: -emia."),
      W("Cardio-", "Cardio- (coração)", "Kár-di-ou", "Prefix or root meaning heart.", "Cardio- means heart, as in cardiomegaly."),
      W("Gastro-", "Gastro- (estômago)", "Gás-trou", "Prefix or root meaning stomach.", "Gastro- means stomach, as in gastritis."),
      W("Hepato-", "Hepato- (fígado)", "Ré-pa-tou", "Prefix or root meaning liver.", "Hepato- means liver, as in hepatomegaly."),
      W("Nephro-", "Nefro- (rim)", "Né-frou", "Prefix or root meaning kidney. Renal also refers to the kidney.", "Nephro- means kidney, as in nephrology."),
      W("Hyper-", "Hiper- (acima, excesso)", "Rái-pãr", "Prefix meaning above normal or too much.", "Hyper- means too much, as in hypertension."),
      W("Hypo-", "Hipo- (abaixo, deficiência)", "Rái-pou", "Prefix meaning below normal or too little.", "Hypo- means too little, as in hypoglycemia."),
      W("Tachy-", "Taqui- (rápido)", "Té-ki", "Prefix meaning fast.", "Tachy- means fast, as in tachycardia."),
      W("Brady-", "Bradi- (lento)", "Bré-di", "Prefix meaning slow.", "Brady- means slow, as in bradycardia."),
      W("Dys-", "Dis- (difícil, anormal)", "Dís", "Prefix meaning difficult, painful or abnormal.", "Dys- means difficult, as in dysphagia."),
      W("-megaly", "-megalia (aumento)", "Mé-ga-li", "Suffix meaning enlargement.", "Splenomegaly is an enlarged spleen: -megaly.")
    ],
    reading: {
      title: "Understanding medical words",
      text: "Most medical words are built from parts that come from Greek and Latin. A word root gives the main meaning, a prefix comes before the root and a suffix comes after it. For example, in 'gastritis', gastr- means stomach and -itis means inflammation, so gastritis is inflammation of the stomach. In 'tachycardia', tachy- means fast and cardi- means heart: a fast heart rate. If you learn the most common parts, you can understand many new words without a dictionary.",
      pt: "A maioria das palavras médicas é formada por partes vindas do grego e do latim. A raiz dá o significado principal, o prefixo vem antes da raiz e o sufixo depois. Por exemplo, em 'gastritis', gastr- significa estômago e -itis significa inflamação: inflamação do estômago. Em 'tachycardia', tachy- significa rápido e cardi- coração: frequência cardíaca acelerada. Aprendendo as partes mais comuns, você entende muitas palavras novas sem dicionário.",
      questions: [
        { q: "What does 'hepatitis' mean?", options: ["Removal of the liver", "Inflammation of the liver", "Pain in the stomach", "Enlarged kidney"], a: 1 },
        { q: "'Bradycardia' means…", options: ["Slow heart rate", "Fast heart rate", "Heart pain", "Large heart"], a: 0 },
        { q: "A suffix comes…", options: ["Before the root", "After the root", "Only in Latin words", "In the middle of a prefix"], a: 1 }
      ]
    }
  },
  {
    id: "radiography", section: "s2", title: "Radiografia e imagem", en: "Radiography and imaging", source: "Material base: Radiography",
    words: [
      W("X-ray", "Raio X / radiografia", "Éks-rêi", "A quick, painless test that produces images of the inside of the body, especially bones.", "The X-ray shows a fracture of the wrist."),
      W("Radiograph", "Radiografia", "Rêi-di-ou-gréf", "A two-dimensional image made with X-rays.", "The radiograph is displayed in white, black and shades of gray."),
      W("Radiopaque", "Radiopaco", "Rêi-di-ou-pêik", "Appearing white on an X-ray because it absorbs the beam (high density).", "Bone is radiopaque on an X-ray."),
      W("Radiolucent", "Radiotransparente / radiolúcido", "Rêi-di-ou-lú-sent", "Appearing black on an X-ray because the beam passes through (low density).", "Air is radiolucent and appears black."),
      W("Beam", "Feixe", "Bíim", "A line of rays, such as X-rays.", "Dense structures absorb more of the beam."),
      W("Density", "Densidade", "Dén-si-ri", "How compact a material is; it decides how white it looks on an X-ray.", "The density of the object determines how much of the beam is absorbed."),
      W("Thickness", "Espessura", "Thík-nés", "How thick something is.", "Thickness and shape also influence the image."),
      W("Shades of gray", "Tons de cinza", "Shêids óv Grêi", "Different levels of gray in an image.", "Soft tissues appear in shades of gray."),
      W("Fracture", "Fratura", "Frék-tchãr", "A break in a bone.", "There is a fracture of the femur."),
      W("Dislocation", "Luxação", "Dis-lou-kêi-shãn", "When a bone moves out of its normal position in a joint.", "The X-ray confirmed a dislocation of the shoulder."),
      W("Cortex", "Córtex (cortical)", "Kór-teks", "The dense outer layer of a bone.", "A break in the cortex suggests a fracture."),
      W("Soft tissue", "Partes moles", "Sóft Tí-shu", "Body tissue that is not bone, such as muscle, fat and organs.", "Soft tissue appears gray on an X-ray."),
      W("CT scan", "Tomografia computadorizada", "Si-tí Skén", "Computed tomography: many X-ray images that create cross-sections of the body.", "The CT scan of the head was normal."),
      W("MRI", "Ressonância magnética", "Ém-ar-ái", "Magnetic resonance imaging: uses a magnet and radio waves, no radiation.", "The MRI showed a herniated disc."),
      W("Ultrasound", "Ultrassom / ultrassonografia", "Ál-tra-sáund", "Imaging with sound waves, without radiation.", "An ultrasound of the abdomen was requested."),
      W("Contrast", "Contraste", "Kón-trést", "A substance given to make structures more visible in images.", "The CT scan was done with contrast.")
    ],
    reading: {
      title: "Why bones are white",
      text: "The different structures of the body have different densities. On a radiograph, structures with higher density absorb more of the X-ray beam, so less of the beam reaches the detector and they look white: they are radiopaque. Structures with lower density, like air, absorb very little of the beam and look black: they are radiolucent. There are four basic radiographic densities: air (black), fat (gray to black), soft tissue and fluid (gray), and metal, calcium and bone (white). X-rays are cheap, quick and widely available, and they are excellent to look for fractures.",
      pt: "As estruturas do corpo têm densidades diferentes. Na radiografia, estruturas de maior densidade absorvem mais o feixe de raios X; menos feixe chega ao detector e elas parecem brancas: são radiopacas. Estruturas de menor densidade, como o ar, absorvem pouco o feixe e parecem pretas: são radiotransparentes. Há quatro densidades radiográficas básicas: ar (preto), gordura (cinza a preto), partes moles e líquido (cinza) e metal, cálcio e osso (branco). O raio X é barato, rápido e amplamente disponível, e é excelente para procurar fraturas.",
      questions: [
        { q: "How does air appear on an X-ray?", options: ["White", "Gray", "Black", "Blue"], a: 2 },
        { q: "Bone is…", options: ["Radiolucent", "Radiopaque", "Invisible", "Gray like fat"], a: 1 },
        { q: "What color is soft tissue?", options: ["Gray", "White", "Black", "Yellow"], a: 0 }
      ]
    }
  },

  /* ---------------- SEÇÃO 3 ---------------- */
  {
    id: "cardio", section: "s3", title: "Sistema cardiovascular", en: "The cardiovascular system",
    words: [
      W("Heart", "Coração", "Rárt", "The organ that pumps blood around the body.", "The heart pumps blood through the body."),
      W("Artery", "Artéria", "Ár-te-ri", "A blood vessel that carries blood away from the heart.", "The coronary artery was blocked."),
      W("Vein", "Veia", "Vêin", "A blood vessel that carries blood back to the heart.", "The nurse drew blood from a vein in his arm."),
      W("Heart rate", "Frequência cardíaca", "Rárt Rêit", "The number of heartbeats per minute.", "Her heart rate is 72 beats per minute."),
      W("Chest pain", "Dor torácica", "Tchést Pêin", "Pain in the chest; it can be a sign of a heart attack.", "He arrived with chest pain and sweating."),
      W("Heart attack", "Infarto (popular)", "Rárt a-ték", "Damage to the heart muscle because its blood supply stops (myocardial infarction).", "Chest pain spreading to the arm can be a heart attack."),
      W("Myocardial infarction", "Infarto agudo do miocárdio", "Mai-ou-kár-di-al In-fárk-shãn", "The medical term for a heart attack (MI).", "The ECG shows an acute myocardial infarction."),
      W("Hypertension", "Hipertensão", "Rai-pãr-tén-shãn", "High blood pressure.", "Hypertension increases the risk of stroke."),
      W("Heart failure", "Insuficiência cardíaca", "Rárt Fêi-liãr", "When the heart cannot pump enough blood for the body's needs.", "Patients with heart failure often have swollen ankles."),
      W("Palpitations", "Palpitações", "Pal-pi-têi-shãns", "Feeling your heart beating fast, hard or irregularly.", "She complains of palpitations at night."),
      W("Murmur", "Sopro", "Mãr-mãr", "An abnormal sound of the heart heard with a stethoscope.", "There is a systolic murmur at the apex."),
      W("Arrhythmia", "Arritmia", "A-ríth-mi-a", "An irregular heartbeat.", "Atrial fibrillation is a common arrhythmia."),
      W("ECG", "Eletrocardiograma", "Í-si-djí", "Electrocardiogram: a test that records the electrical activity of the heart (EKG in the US).", "We need an ECG for every patient with chest pain."),
      W("Blood clot", "Coágulo", "Blád Klót", "A lump of blood that has become solid (thrombus).", "A blood clot in the leg is called deep vein thrombosis."),
      W("Stroke", "AVC (acidente vascular cerebral)", "Strôuk", "Damage to the brain because its blood supply is blocked or a vessel bleeds.", "Hypertension is the main risk factor for stroke."),
      W("Cholesterol", "Colesterol", "Ko-lés-te-rol", "A fatty substance in the blood; high levels increase heart disease risk.", "His cholesterol is too high.")
    ],
    reading: {
      title: "Heart disease: the number one killer",
      text: "According to the World Health Organization (WHO), cardiovascular diseases are the leading cause of death in the world. The main type is coronary heart disease, which can cause a heart attack. Important risk factors are hypertension, high cholesterol, diabetes, smoking, an unhealthy diet and physical inactivity. A typical heart attack causes chest pain that may radiate to the left arm, the jaw or the back, often with sweating, nausea and shortness of breath. Anyone with these symptoms should call an ambulance immediately.",
      pt: "Segundo a Organização Mundial da Saúde (OMS), as doenças cardiovasculares são a principal causa de morte no mundo. O tipo principal é a doença coronariana, que pode causar infarto. Fatores de risco importantes são hipertensão, colesterol alto, diabetes, tabagismo, dieta inadequada e sedentarismo. Um infarto típico causa dor torácica que pode irradiar para o braço esquerdo, mandíbula ou costas, frequentemente com sudorese, náusea e falta de ar. Quem tiver esses sintomas deve chamar uma ambulância imediatamente.",
      questions: [
        { q: "What is the leading cause of death in the world, according to the WHO?", options: ["Cancer", "Cardiovascular diseases", "Infections", "Accidents"], a: 1 },
        { q: "Which is NOT a risk factor in the text?", options: ["Smoking", "Hypertension", "Drinking water", "Physical inactivity"], a: 2 },
        { q: "Where can the pain of a heart attack radiate?", options: ["To the left arm or jaw", "To the knee", "To the feet", "To the eyes"], a: 0 }
      ]
    }
  },
  {
    id: "resp", section: "s3", title: "Sistema respiratório", en: "The respiratory system",
    words: [
      W("Lungs", "Pulmões", "Lãngs", "The two organs in the chest used for breathing.", "Both lungs are clear on auscultation."),
      W("Airway", "Via aérea", "Ér-uêi", "The passage through which air reaches the lungs.", "First, check that the airway is open."),
      W("Windpipe", "Traqueia (popular)", "Uínd-páip", "The common word for the trachea.", "The windpipe carries air to the lungs."),
      W("Wheezing", "Sibilância / chiado", "Uíi-zin", "A high whistling sound when breathing, common in asthma.", "The child has wheezing and cough."),
      W("Crackles", "Estertores / crepitações", "Kré-kãls", "Short popping sounds heard in the lungs, for example in pneumonia.", "There are crackles at the right lung base."),
      W("Asthma", "Asma", "Éz-ma", "A chronic disease that narrows the airways and causes wheezing.", "She uses an inhaler for her asthma."),
      W("Pneumonia", "Pneumonia", "Niu-môu-ni-a", "An infection of the lungs.", "The chest X-ray confirms pneumonia."),
      W("Sputum", "Escarro / expectoração", "Spiú-tum", "Mucus coughed up from the lungs (phlegm).", "He coughs up yellow sputum."),
      W("Inhaler", "Inalador / bombinha", "In-rêi-lãr", "A device used to breathe medicine into the lungs.", "Use your inhaler twice a day."),
      W("Oxygen saturation", "Saturação de oxigênio", "Ók-si-djen Sé-tchu-rêi-shãn", "The percentage of oxygen in the blood, measured with a pulse oximeter.", "Her oxygen saturation is 95% on room air."),
      W("Respiratory rate", "Frequência respiratória", "Rés-pi-ra-to-ri Rêit", "The number of breaths per minute.", "The respiratory rate is 18 breaths per minute."),
      W("Tuberculosis", "Tuberculose", "Tu-bãr-kiu-lôu-sis", "An infectious disease caused by Mycobacterium tuberculosis, mainly affecting the lungs (TB).", "Tuberculosis can cause cough, fever, night sweats and weight loss."),
      W("COPD", "DPOC", "Si-ou-pi-dí", "Chronic obstructive pulmonary disease, often caused by smoking.", "COPD is common in long-term smokers."),
      W("Night sweats", "Sudorese noturna", "Náit Suéts", "Heavy sweating during sleep.", "Ask about fever and night sweats."),
      W("Short of breath", "Com falta de ar", "Shórt óv Bréth", "Having difficulty breathing.", "I get short of breath when I walk fast."),
      W("Nebulizer", "Nebulizador", "Né-biu-lai-zãr", "A machine that turns liquid medicine into a mist to breathe in.", "The child received salbutamol by nebulizer.")
    ],
    reading: {
      title: "Asthma in a child",
      text: "Pedro is 8 years old. His mother brings him to the emergency room because he has had a cough and wheezing since last night. He is short of breath and cannot speak in full sentences. His respiratory rate is 32 breaths per minute and his oxygen saturation is 93%. On auscultation there is wheezing in both lungs, but no crackles. The doctor gives salbutamol by nebulizer and a corticosteroid. After one hour, Pedro is much better. His mother learns how to use the inhaler with a spacer.",
      pt: "Pedro tem 8 anos. Sua mãe o traz ao pronto-socorro porque ele tem tosse e chiado desde a noite passada. Está com falta de ar e não consegue falar frases completas. A frequência respiratória é 32 irpm e a saturação é 93%. Na ausculta há sibilos nos dois pulmões, sem estertores. A médica administra salbutamol por nebulização e um corticoide. Após uma hora, Pedro está muito melhor. A mãe aprende a usar a bombinha com espaçador.",
      questions: [
        { q: "What sound is heard in Pedro's lungs?", options: ["Crackles", "Wheezing", "A murmur", "No sound"], a: 1 },
        { q: "How is salbutamol given?", options: ["By injection", "By nebulizer", "As a tablet", "On the skin"], a: 1 },
        { q: "What does his mother learn?", options: ["How to use the inhaler", "How to take blood pressure", "How to do CPR", "How to read an X-ray"], a: 0 }
      ]
    }
  },
  {
    id: "gi", section: "s3", title: "Sistema digestivo", en: "The digestive system",
    words: [
      W("Stomach", "Estômago", "Stã-mak", "The organ where food goes after it is swallowed.", "The stomach produces acid to digest food."),
      W("Liver", "Fígado", "Lí-vãr", "A large organ that cleans the blood and produces bile.", "Alcohol can damage the liver."),
      W("Bowel", "Intestino", "Báu-el", "The intestine; the long tube from the stomach to the anus.", "He has a change in bowel habits."),
      W("Gallbladder", "Vesícula biliar", "Gól-blé-dãr", "A small organ that stores bile, under the liver.", "Stones in the gallbladder can cause pain after fatty meals."),
      W("Heartburn", "Azia", "Rárt-bãrn", "A burning feeling in the chest caused by stomach acid.", "Heartburn is common after big meals."),
      W("Diarrhea", "Diarreia", "Dai-a-rí-a", "Frequent, liquid stools (UK spelling: diarrhoea).", "The child has diarrhea and needs oral rehydration."),
      W("Constipation", "Prisão de ventre / constipação intestinal", "Kons-ti-pêi-shãn", "Difficulty passing stools. It is NOT a cold!", "Drink more water to prevent constipation."),
      W("Bloating", "Distensão / estufamento", "Blôu-rin", "A feeling that the abdomen is full and swollen.", "She complains of bloating after meals."),
      W("Stool", "Fezes", "Stúul", "Feces; the solid waste from the bowel.", "Is there any blood in the stool?"),
      W("Jaundice", "Icterícia", "Djón-dis", "Yellow color of the skin and eyes, often due to liver disease.", "The patient has jaundice and dark urine."),
      W("Swallow", "Engolir", "Suó-lou", "To make food or drink go down the throat.", "Does it hurt when you swallow?"),
      W("Appendicitis", "Apendicite", "A-pen-di-sái-tis", "Inflammation of the appendix.", "Pain in the right lower quadrant can be appendicitis."),
      W("Gastroenteritis", "Gastroenterite", "Gás-trou-en-te-rái-tis", "Infection of the stomach and bowel causing vomiting and diarrhea.", "Gastroenteritis is usually caused by a virus."),
      W("Bowel movement", "Evacuação", "Báu-el Múuv-ment", "Passing stool.", "When was your last bowel movement?"),
      W("Upset stomach", "Mal-estar estomacal", "Áp-set Stã-mak", "A mild problem with digestion, like nausea or discomfort.", "Spicy food gives me an upset stomach."),
      W("Cramps", "Cólicas", "Krémps", "Sudden painful contractions of a muscle, often in the abdomen.", "He has abdominal cramps and diarrhea.")
    ],
    reading: {
      title: "Abdominal pain",
      text: "Lucas is 19 years old. His pain started around the umbilicus yesterday and then moved to the right lower quadrant. He has nausea, he vomited once and he has no appetite. He has a low fever. On palpation, there is tenderness in the right lower quadrant. His bowel movements are normal and there is no blood in the stool. The surgeon suspects appendicitis and requests blood tests and an ultrasound. If the diagnosis is confirmed, he will have an appendectomy.",
      pt: "Lucas tem 19 anos. A dor começou ao redor do umbigo ontem e depois migrou para a fossa ilíaca direita. Ele tem náusea, vomitou uma vez e está sem apetite. Tem febre baixa. À palpação, há dor na fossa ilíaca direita. As evacuações estão normais e não há sangue nas fezes. O cirurgião suspeita de apendicite e pede exames de sangue e ultrassom. Se o diagnóstico for confirmado, ele fará uma apendicectomia.",
      questions: [
        { q: "Where did the pain start?", options: ["Around the umbilicus", "In the chest", "In the back", "In the head"], a: 0 },
        { q: "What does the surgeon suspect?", options: ["Gastroenteritis", "Appendicitis", "Heartburn", "Constipation"], a: 1 },
        { q: "What is an appendectomy?", options: ["Inflammation of the appendix", "Removal of the appendix", "An X-ray of the appendix", "A medicine"], a: 1 }
      ]
    }
  },
  {
    id: "neuro", section: "s3", title: "Sistema nervoso", en: "The nervous system",
    words: [
      W("Brain", "Cérebro / encéfalo", "Brêin", "The organ inside the head that controls thought and the body.", "The brain is protected by the skull."),
      W("Nerve", "Nervo", "Nãrv", "A fiber that carries messages between the brain and the body.", "The facial nerve controls the muscles of the face."),
      W("Seizure", "Crise convulsiva", "Síi-jãr", "A sudden abnormal electrical activity in the brain, often with shaking.", "The child had a seizure with fever."),
      W("Numbness", "Dormência", "Nãm-nés", "Loss of feeling in a part of the body.", "She has numbness in her left hand."),
      W("Tingling", "Formigamento", "Tín-glin", "A feeling of pins and needles.", "Diabetes can cause tingling in the feet."),
      W("Weakness", "Fraqueza", "Uíik-nés", "Lack of strength in the muscles.", "Sudden weakness of one side of the body is a sign of stroke."),
      W("Unconscious", "Inconsciente", "An-kón-shãs", "Not awake and not able to respond.", "The man was found unconscious on the floor."),
      W("Faint", "Desmaiar / desmaio", "Fêint", "To lose consciousness for a short time.", "She felt dizzy and almost fainted. Did you faint?"),
      W("Migraine", "Enxaqueca", "Mái-grêin", "A strong headache, often with nausea and sensitivity to light.", "Her migraine gets worse with bright light."),
      W("Slurred speech", "Fala arrastada", "Slãrd Spíitch", "Speech that is unclear because of difficulty moving the mouth.", "Slurred speech is a warning sign of stroke."),
      W("Confusion", "Confusão mental", "Kon-fiú-jãn", "Not being able to think clearly.", "Elderly patients with infection can present with confusion."),
      W("Drooping", "Queda (ex.: da face)", "Drúu-pin", "Hanging down; for example, one side of the face.", "Face drooping is the F in the FAST test."),
      W("Spinal tap", "Punção lombar", "Spái-nal Tép", "A procedure to collect fluid from the spine (lumbar puncture).", "A spinal tap was done to rule out meningitis."),
      W("Meningitis", "Meningite", "Mé-nin-djái-tis", "Inflammation of the membranes around the brain and spinal cord.", "Fever, headache and stiff neck suggest meningitis."),
      W("Tremor", "Tremor", "Tré-mãr", "Shaking movements you cannot control.", "Parkinson's disease causes a resting tremor."),
      W("Memory loss", "Perda de memória", "Mé-mo-ri Lós", "Difficulty remembering things.", "Memory loss is an early sign of dementia.")
    ],
    reading: {
      title: "BE FAST: recognize a stroke",
      text: "Stroke is a medical emergency. Many health organizations teach the FAST test, sometimes called BE FAST: Balance (sudden loss of balance), Eyes (sudden loss of vision), Face drooping (ask the person to smile), Arm weakness (ask the person to raise both arms), Speech difficulty (slurred speech or confusion) and Time to call emergency services. Note the time when the symptoms started. Fast treatment can save the brain: 'time is brain'.",
      pt: "O AVC é uma emergência médica. Muitas organizações de saúde ensinam o teste FAST, às vezes chamado BE FAST: Equilíbrio (perda súbita de equilíbrio), Olhos (perda súbita de visão), Face caída (peça para a pessoa sorrir), Braço fraco (peça para levantar os dois braços), Fala alterada (arrastada ou confusa) e Tempo de chamar a emergência. Anote o horário de início dos sintomas. Tratamento rápido salva o cérebro: 'tempo é cérebro'.",
      questions: [
        { q: "In FAST, what does 'A' stand for?", options: ["Airway", "Arm weakness", "Allergy", "Ankle"], a: 1 },
        { q: "How do you test for face drooping?", options: ["Ask the person to smile", "Check the pulse", "Ask about allergies", "Take an X-ray"], a: 0 },
        { q: "What does 'time is brain' mean?", options: ["Fast treatment saves the brain", "The brain controls time", "Strokes happen at night", "Wait and see"], a: 0 }
      ]
    }
  },
  {
    id: "renal", section: "s3", title: "Rins e trato urinário", en: "Kidneys and urinary tract",
    words: [
      W("Kidney", "Rim", "Kíd-ni", "One of two organs that filter the blood and make urine.", "Each kidney filters the blood."),
      W("Bladder", "Bexiga", "Blé-dãr", "The organ that stores urine.", "The bladder can hold about 400 ml of urine."),
      W("Urine", "Urina", "Iú-rin", "The liquid waste made by the kidneys.", "The urine is dark and cloudy."),
      W("Pee", "Fazer xixi (informal)", "Píi", "Informal word for passing urine.", "Does it burn when you pee?"),
      W("Urinary tract infection", "Infecção urinária", "Iú-ri-ne-ri Trékt In-fék-shãn", "An infection of the bladder, urethra or kidneys (UTI).", "A urinary tract infection is more common in women."),
      W("Burning", "Ardência / queimação", "Bãr-nin", "A painful hot feeling.", "She feels burning when passing urine."),
      W("Frequency", "Polaciúria (urinar muitas vezes)", "Frí-kuen-si", "Needing to pass urine very often.", "Frequency and urgency suggest cystitis."),
      W("Urgency", "Urgência miccional", "Ãr-djen-si", "A sudden strong need to pass urine.", "She reports urgency and burning."),
      W("Kidney stone", "Cálculo renal / pedra nos rins", "Kíd-ni Stôun", "A hard mass formed in the kidney (renal calculus).", "A kidney stone causes severe flank pain."),
      W("Flank", "Flanco", "Flénk", "The side of the body between the ribs and the hip.", "The pain is in the right flank and goes to the groin."),
      W("Blood in the urine", "Sangue na urina / hematúria", "Blád in dã Iú-rin", "Hematuria.", "Have you noticed blood in the urine?"),
      W("Catheter", "Sonda / cateter", "Ké-the-rãr", "A thin tube put into the body, for example into the bladder.", "The nurse inserted a urinary catheter."),
      W("Dialysis", "Diálise", "Dai-é-li-sis", "A treatment that cleans the blood when the kidneys fail.", "He needs dialysis three times a week."),
      W("Urinalysis", "Exame de urina (EAS)", "Iu-ri-né-li-sis", "A laboratory test of the urine.", "The urinalysis shows nitrites and leukocytes."),
      W("Kidney failure", "Insuficiência renal", "Kíd-ni Fêi-liãr", "When the kidneys stop working well.", "Diabetes and hypertension are the main causes of kidney failure."),
      W("Prostate", "Próstata", "Prós-teit", "A gland below the male bladder.", "An enlarged prostate can cause difficulty passing urine.")
    ],
    reading: {
      title: "A simple urinary tract infection",
      text: "Ana is 30 years old and is not pregnant. For two days she has had burning when she pees, frequency and urgency. She has no fever and no flank pain. The urinalysis shows leukocytes and nitrites. The doctor explains that this is probably a lower urinary tract infection (cystitis) and prescribes an antibiotic for a few days. He tells her to drink plenty of fluids and to come back if she gets a fever, flank pain or blood in the urine, because these can be signs of a kidney infection.",
      pt: "Ana tem 30 anos e não está grávida. Há dois dias sente ardência ao urinar, polaciúria e urgência. Não tem febre nem dor no flanco. O exame de urina mostra leucócitos e nitrito. O médico explica que provavelmente é uma infecção urinária baixa (cistite) e prescreve um antibiótico por poucos dias. Orienta a beber bastante líquido e voltar se tiver febre, dor no flanco ou sangue na urina, pois podem ser sinais de infecção renal.",
      questions: [
        { q: "What are Ana's symptoms?", options: ["Fever and flank pain", "Burning, frequency and urgency", "Cough and wheezing", "Headache"], a: 1 },
        { q: "What does the urinalysis show?", options: ["Glucose", "Leukocytes and nitrites", "Nothing", "Blood only"], a: 1 },
        { q: "When should she come back?", options: ["If she feels better", "If she gets fever or flank pain", "Never", "In one year"], a: 1 }
      ]
    }
  },

  /* ---------------- SEÇÃO 4 ---------------- */
  {
    id: "pharm", section: "s4", title: "Medicamentos e prescrição", en: "Medication and prescriptions",
    words: [
      W("Prescription", "Receita médica", "Pris-kríp-shãn", "A written order from a doctor for a medicine.", "You need a prescription for this antibiotic."),
      W("Dose", "Dose", "Dôus", "The amount of medicine taken at one time.", "The dose is 500 mg every eight hours."),
      W("Tablet", "Comprimido", "Té-blet", "A small solid piece of medicine (pill).", "Take one tablet twice a day."),
      W("Capsule", "Cápsula", "Kép-siul", "Medicine inside a small soluble container.", "Swallow the capsule with water."),
      W("Side effect", "Efeito colateral", "Sáid i-fékt", "An unwanted effect of a medicine.", "Nausea is a common side effect."),
      W("Painkiller", "Analgésico", "Pêin-ki-lãr", "A medicine that reduces pain (analgesic).", "She took a painkiller for her headache."),
      W("Antibiotic", "Antibiótico", "Én-ti-bai-ó-tik", "A medicine that kills bacteria; it does not work against viruses.", "An antibiotic does not treat the common cold."),
      W("Over-the-counter", "Isento de prescrição (venda livre)", "Ôu-vãr dã Káun-tãr", "A medicine you can buy without a prescription (OTC).", "Paracetamol is an over-the-counter medicine."),
      W("Injection", "Injeção", "In-djék-shãn", "Putting medicine into the body with a needle.", "The vaccine is given by injection."),
      W("Ointment", "Pomada", "Óint-ment", "A cream-like medicine put on the skin.", "Apply the ointment to the wound twice a day."),
      W("Drops", "Gotas / colírio", "Dróps", "Liquid medicine given in small amounts.", "Use two drops in each eye."),
      W("Take with food", "Tomar com alimento", "Têik uíd Fúud", "An instruction to take medicine during a meal.", "Take with food to avoid an upset stomach."),
      W("On an empty stomach", "Em jejum", "Ón an Émp-ti Stã-mak", "Before eating; without food in the stomach.", "Take levothyroxine on an empty stomach."),
      W("Refill", "Renovação da receita", "Rí-fil", "Getting more of the same medicine again.", "You can get a refill next month."),
      W("Overdose", "Superdosagem / overdose", "Ôu-vãr-dôus", "Taking too much of a medicine or drug.", "Paracetamol overdose can damage the liver."),
      W("Allergic reaction", "Reação alérgica", "A-lãr-djik Ri-ék-shãn", "A harmful response of the immune system to a substance.", "Stop the drug if you have an allergic reaction.")
    ],
    reading: {
      title: "Explaining a prescription",
      text: "Doctor: 'I am prescribing an antibiotic called amoxicillin. Take one capsule three times a day for seven days. You can take it with food. It is important to finish the course, even if you feel better. Common side effects are diarrhea and nausea. If you get a rash, swelling of the face or difficulty breathing, stop taking it and go to the emergency room: that may be an allergic reaction. For the pain, you can take paracetamol, which is an over-the-counter painkiller. Do you have any questions?'",
      pt: "Médico: 'Estou prescrevendo um antibiótico chamado amoxicilina. Tome uma cápsula três vezes ao dia por sete dias. Pode tomar com alimento. É importante completar o tratamento, mesmo que se sinta melhor. Efeitos colaterais comuns são diarreia e náusea. Se tiver manchas na pele, inchaço no rosto ou dificuldade para respirar, pare de tomar e vá ao pronto-socorro: pode ser uma reação alérgica. Para a dor, pode tomar paracetamol, que é um analgésico de venda livre. Alguma dúvida?'",
      questions: [
        { q: "How often should the patient take the capsule?", options: ["Once a day", "Twice a day", "Three times a day", "Every hour"], a: 2 },
        { q: "What should the patient do if the face swells?", options: ["Take another dose", "Stop and go to the emergency room", "Drink water", "Nothing"], a: 1 },
        { q: "Paracetamol is described as…", options: ["An antibiotic", "An over-the-counter painkiller", "An ointment", "An injection"], a: 1 }
      ]
    }
  },
  {
    id: "emergency", section: "s4", title: "Emergência e BLS", en: "Emergency and basic life support",
    words: [
      W("Cardiac arrest", "Parada cardíaca", "Kár-di-ak a-rést", "When the heart suddenly stops pumping blood.", "He had a cardiac arrest in the waiting room."),
      W("CPR", "RCP (reanimação cardiopulmonar)", "Si-pi-ár", "Cardiopulmonary resuscitation: chest compressions and breaths.", "Start CPR immediately."),
      W("Chest compressions", "Compressões torácicas", "Tchést Kom-pré-shãns", "Pushing hard and fast on the center of the chest during CPR.", "Do chest compressions at 100 to 120 per minute."),
      W("Defibrillator", "Desfibrilador", "Di-fí-bri-lei-rãr", "A device that gives an electric shock to restore a normal heart rhythm (AED).", "Get the defibrillator now!"),
      W("Unresponsive", "Não responsivo", "An-ris-pón-siv", "Not reacting when you talk to or touch the person.", "The patient is unresponsive and not breathing."),
      W("Call for help", "Pedir ajuda", "Kól fór Rélp", "To shout or phone for assistance.", "Check the scene and call for help."),
      W("Bleeding", "Sangramento", "Blíi-din", "Losing blood.", "Apply pressure to stop the bleeding."),
      W("Wound", "Ferida", "Uúund", "An injury where the skin is cut or broken.", "Clean the wound with saline."),
      W("Burn", "Queimadura", "Bãrn", "An injury caused by heat, chemicals or electricity.", "Cool the burn with running water."),
      W("Choking", "Engasgo", "Tchôu-kin", "When something blocks the airway and the person cannot breathe.", "The man is choking on food."),
      W("Shock", "Choque", "Shók", "A dangerous state when the organs do not get enough blood.", "The patient is in shock: low blood pressure and cold skin."),
      W("Triage", "Triagem", "Trí-adj", "Sorting patients by how urgent their condition is.", "Triage decides who is seen first."),
      W("Trauma", "Trauma", "Tró-ma", "A serious physical injury.", "The trauma team is waiting for the ambulance."),
      W("Recovery position", "Posição lateral de segurança", "Ri-kã-ve-ri Po-zí-shãn", "Lying on the side to keep the airway open.", "Put him in the recovery position."),
      W("Paramedic", "Socorrista / paramédico", "Pé-ra-mé-dik", "A trained person who gives emergency care outside the hospital.", "The paramedic started oxygen in the ambulance."),
      W("Stab wound", "Ferimento por arma branca", "Stéb Uúund", "A wound caused by a knife.", "He arrived with a stab wound in the abdomen.")
    ],
    reading: {
      title: "Basic life support for adults",
      text: "The American Heart Association teaches a simple sequence. Make sure the scene is safe. Check if the person is unresponsive and not breathing normally. Call for help, call emergency services and get a defibrillator (AED). Start CPR: push hard and fast in the center of the chest, at a rate of 100 to 120 compressions per minute and a depth of at least 5 cm, allowing the chest to recoil completely. Use the AED as soon as it arrives and follow its instructions. Minimize interruptions in chest compressions.",
      pt: "A American Heart Association ensina uma sequência simples. Garanta que a cena é segura. Verifique se a pessoa não responde e não respira normalmente. Peça ajuda, chame o serviço de emergência e pegue um desfibrilador (DEA). Inicie a RCP: comprima forte e rápido no centro do tórax, 100 a 120 compressões por minuto, com profundidade de pelo menos 5 cm, permitindo o retorno completo do tórax. Use o DEA assim que chegar e siga as instruções. Minimize as interrupções das compressões.",
      questions: [
        { q: "What is the first step?", options: ["Start compressions", "Make sure the scene is safe", "Give medicine", "Take an ECG"], a: 1 },
        { q: "What is the correct compression rate?", options: ["60–80 per minute", "100–120 per minute", "150–180 per minute", "30 per minute"], a: 1 },
        { q: "When should you use the AED?", options: ["As soon as it arrives", "After 30 minutes", "Never", "Only in hospital"], a: 0 }
      ]
    }
  },
  {
    id: "lab", section: "s4", title: "Exames laboratoriais", en: "Laboratory tests",
    words: [
      W("Blood test", "Exame de sangue", "Blád Tést", "A laboratory test done on a sample of blood.", "We need a blood test to check your kidneys."),
      W("Complete blood count", "Hemograma completo", "Kom-plíit Blád Káunt", "A test that counts red cells, white cells and platelets (CBC).", "The complete blood count shows anemia."),
      W("Red blood cells", "Hemácias", "Réd Blád Séls", "Cells that carry oxygen (erythrocytes).", "Red blood cells contain hemoglobin."),
      W("White blood cells", "Leucócitos", "Uáit Blád Séls", "Cells that fight infection (leukocytes).", "The white blood cells are high, suggesting infection."),
      W("Platelets", "Plaquetas", "Plêit-lets", "Small cells that help the blood to clot.", "Low platelets increase the risk of bleeding."),
      W("Hemoglobin", "Hemoglobina", "Rí-mo-glôu-bin", "The protein in red blood cells that carries oxygen.", "Her hemoglobin is 9 g/dL."),
      W("Blood sugar", "Glicemia", "Blád Shú-gãr", "The amount of glucose in the blood.", "His blood sugar is very high."),
      W("Fasting", "Jejum", "Fés-tin", "Not eating, usually for 8 to 12 hours before a test.", "Come fasting for the blood test."),
      W("Sample", "Amostra", "Sém-pãl", "A small amount of blood, urine or tissue for testing.", "The nurse collected a urine sample."),
      W("Electrolytes", "Eletrólitos", "I-lék-tro-laits", "Minerals in the blood like sodium and potassium.", "Check the electrolytes after vomiting and diarrhea."),
      W("Potassium", "Potássio", "Po-té-si-um", "An electrolyte important for the heart and muscles.", "Low potassium can cause arrhythmia."),
      W("Sodium", "Sódio", "Sôu-di-um", "An electrolyte that controls water balance.", "His sodium is low."),
      W("Creatinine", "Creatinina", "Kri-é-ti-nin", "A waste product used to measure kidney function.", "High creatinine suggests kidney failure."),
      W("Normal range", "Valor de referência", "Nór-mal Rêindj", "The values expected in healthy people.", "The result is within the normal range."),
      W("Biopsy", "Biópsia", "Bái-op-si", "Removing a small piece of tissue to examine it.", "A biopsy is needed to confirm the diagnosis."),
      W("Blood culture", "Hemocultura", "Blád Kál-tchãr", "A test to find bacteria in the blood.", "Take two blood culture samples before the antibiotic.")
    ],
    reading: {
      title: "Results of a blood test",
      text: "Mrs. Costa, 68, feels tired and short of breath when she walks. Her complete blood count shows a hemoglobin of 8.5 g/dL, which is below the normal range, so she has anemia. Her red blood cells are small. Her white blood cells and platelets are normal. Her creatinine, sodium and potassium are also normal. The doctor asks about blood in the stool and heavy periods in the past, and requests more tests to find the cause of the iron deficiency.",
      pt: "A Sra. Costa, 68 anos, sente cansaço e falta de ar ao caminhar. O hemograma mostra hemoglobina de 8,5 g/dL, abaixo do valor de referência: ela tem anemia. As hemácias são pequenas. Leucócitos e plaquetas estão normais. Creatinina, sódio e potássio também estão normais. O médico pergunta sobre sangue nas fezes e menstruação abundante no passado e pede mais exames para encontrar a causa da deficiência de ferro.",
      questions: [
        { q: "What does Mrs. Costa have?", options: ["Kidney failure", "Anemia", "Infection", "Low potassium"], a: 1 },
        { q: "Which results are normal?", options: ["Hemoglobin", "Red blood cell size", "White blood cells and platelets", "None"], a: 2 },
        { q: "What deficiency does the doctor suspect?", options: ["Iron", "Sodium", "Vitamin C", "Calcium"], a: 0 }
      ]
    }
  },
  {
    id: "abbrev", section: "s4", title: "Abreviações médicas", en: "Medical abbreviations",
    words: [
      W("BP", "Pressão arterial (PA)", "Bí-pí", "Blood pressure.", "BP is 130/85 mmHg."),
      W("HR", "Frequência cardíaca (FC)", "Êitch-ár", "Heart rate.", "HR is 110, he is tachycardic."),
      W("RR", "Frequência respiratória (FR)", "Ár-ár", "Respiratory rate.", "RR is 22 breaths per minute."),
      W("SOB", "Falta de ar", "És-ou-bí", "Shortness of breath.", "Patient complains of SOB on exertion."),
      W("NPO", "Jejum (nada por via oral)", "Én-pi-ôu", "Nothing by mouth (from Latin nil per os).", "Keep the patient NPO before surgery."),
      W("PRN", "Se necessário (S/N)", "Pi-ár-én", "As needed (from Latin pro re nata).", "Paracetamol 1 g PRN for pain."),
      W("BID", "2x ao dia (12/12h)", "Bí-ai-dí", "Twice a day (from Latin bis in die).", "Amoxicillin BID for 7 days."),
      W("TID", "3x ao dia (8/8h)", "Tí-ai-dí", "Three times a day.", "Take ibuprofen TID with food."),
      W("Stat", "Imediatamente", "Stét", "Immediately (from Latin statim).", "Get an ECG stat!"),
      W("Hx", "História", "Êitch-éks", "History.", "Hx of diabetes for 10 years."),
      W("Dx", "Diagnóstico", "Dí-éks", "Diagnosis.", "Dx: community-acquired pneumonia."),
      W("Tx", "Tratamento", "Tí-éks", "Treatment.", "Tx: oral antibiotics and rest."),
      W("IV", "Endovenoso (EV)", "Ái-ví", "Intravenous: into a vein.", "Start IV fluids now."),
      W("PO", "Via oral (VO)", "Pí-ôu", "By mouth (from Latin per os).", "Switch the antibiotic to PO."),
      W("ICU", "UTI", "Ái-si-iú", "Intensive care unit.", "Transfer the patient to the ICU."),
      W("DOB", "Data de nascimento", "Dí-ou-bí", "Date of birth.", "Please confirm your name and DOB.")
    ],
    reading: {
      title: "Reading a short note",
      text: "65 y/o male. Hx: hypertension and diabetes. Presents with SOB and cough for 3 days. BP 140/90, HR 104, RR 24, SpO2 91% on room air, temperature 38.6 °C. Crackles at the right lung base. Dx: community-acquired pneumonia. Tx: oxygen, IV antibiotics, paracetamol PRN for fever. Keep under observation; if he gets worse, consider transfer to ICU.",
      pt: "Homem de 65 anos. Antecedentes: hipertensão e diabetes. Apresenta falta de ar e tosse há 3 dias. PA 140/90, FC 104, FR 24, SpO2 91% em ar ambiente, temperatura 38,6 °C. Estertores na base pulmonar direita. Diagnóstico: pneumonia adquirida na comunidade. Tratamento: oxigênio, antibiótico EV, paracetamol se necessário para febre. Manter em observação; se piorar, considerar transferência para UTI.",
      questions: [
        { q: "What does 'SOB' mean in the note?", options: ["Son of a bitch", "Shortness of breath", "Sound of breathing", "Start of bleeding"], a: 1 },
        { q: "How is the antibiotic given?", options: ["PO", "IV", "On the skin", "PRN"], a: 1 },
        { q: "What is the diagnosis?", options: ["Asthma", "Heart failure", "Community-acquired pneumonia", "Stroke"], a: 2 }
      ]
    }
  },
  {
    id: "falsefriends", section: "s4", title: "Falsos cognatos", en: "False friends",
    words: [
      W("Constipation", "Prisão de ventre (NÃO é resfriado)", "Kons-ti-pêi-shãn", "Difficulty passing stools. 'Resfriado' is 'a cold'.", "Constipation is a common side effect of opioids."),
      W("Cold", "Resfriado", "Kôuld", "A mild viral infection of the nose and throat.", "I caught a cold last week."),
      W("Injury", "Lesão / ferimento (NÃO é injúria)", "Ín-dju-ri", "Physical damage to the body.", "He has a knee injury from football."),
      W("Exquisite pain", "Dor intensa e localizada (NÃO é 'esquisita')", "Éks-kui-zit Pêin", "Very intense, sharp, well localized pain.", "There is exquisite pain on palpation of the tibia."),
      W("Pretend", "Fingir (NÃO é pretender)", "Pri-ténd", "To act as if something is true when it is not.", "The child pretends to be sick to miss school."),
      W("Intend", "Pretender / ter a intenção", "In-ténd", "To plan to do something.", "We intend to discharge him tomorrow."),
      W("Attend", "Comparecer / frequentar (NÃO é atender)", "A-ténd", "To go to an event or place.", "She did not attend her appointment."),
      W("Prescribe", "Prescrever / receitar", "Pris-kráib", "To order a medicine for a patient.", "The doctor will prescribe an inhaler."),
      W("Sensible", "Sensato (NÃO é sensível)", "Sén-si-bãl", "Reasonable, with good judgment.", "Stopping smoking is a sensible decision."),
      W("Sensitive", "Sensível", "Sén-si-tiv", "Easily affected; reacting strongly.", "Her skin is sensitive to the sun."),
      W("Pull", "Puxar (NÃO é empurrar)", "Púul", "To move something towards you.", "Pull the door to open it."),
      W("Push", "Empurrar", "Púsh", "To move something away from you; also to press.", "Push hard and fast on the chest."),
      W("Physician", "Médico (NÃO é físico)", "Fi-zí-shãn", "A doctor. A 'physicist' studies physics.", "The physician ordered more tests."),
      W("Medicine", "Remédio E também medicina", "Mé-di-sin", "Both a drug and the science of treating disease.", "She studies medicine and takes medicine for asthma."),
      W("Intoxicated", "Embriagado (geralmente por álcool)", "In-tók-si-kei-red", "Usually drunk from alcohol. For 'intoxicação' use poisoning.", "The driver was intoxicated."),
      W("Poisoning", "Intoxicação / envenenamento", "Pói-zo-nin", "Illness caused by a toxic substance.", "Carbon monoxide poisoning causes headache and confusion.")
    ],
    reading: {
      title: "Careful with false friends!",
      text: "Brazilian doctors often make mistakes with false friends. If a patient says 'I have constipation', it means he cannot pass stools, not that he has a cold. 'Exquisite pain' is very intense localized pain, not strange pain. An 'injury' is a physical lesion, not an insult. If a patient 'pretends' to be sick, he is faking it. And if a patient did not 'attend' the appointment, he did not go. When someone eats bad food and gets sick, we say 'food poisoning', not 'food intoxication'.",
      pt: "Médicos brasileiros frequentemente erram com falsos cognatos. Se um paciente diz 'I have constipation', significa que ele não consegue evacuar, não que está resfriado. 'Exquisite pain' é dor muito intensa e localizada, não dor estranha. 'Injury' é uma lesão física, não uma ofensa. Se um paciente 'pretends' estar doente, ele está fingindo. E se um paciente não 'attended' a consulta, ele não compareceu. Quando alguém come algo estragado e passa mal, dizemos 'food poisoning', não 'food intoxication'.",
      questions: [
        { q: "'I have constipation' means…", options: ["I have a cold", "I cannot pass stools", "I have a fever", "I am tired"], a: 1 },
        { q: "'He pretends to be sick' means…", options: ["He intends to be sick", "He is faking it", "He is very sick", "He wants to see a doctor"], a: 1 },
        { q: "The best term for 'intoxicação alimentar' is…", options: ["Food intoxication", "Food poisoning", "Food injury", "Food constipation"], a: 1 }
      ]
    }
  }
];

/* Casos clínicos simples: o foco é a leitura em inglês, não a dificuldade médica. */
const CASES = [
  {
    id: "c1", title: "The sore throat", level: "Fácil", topic: "symptoms",
    text: "A 22-year-old student comes to the clinic. She has had a sore throat and a fever for three days. It hurts when she swallows. She has no cough. On examination, her tonsils are red and swollen with white spots, and the lymph nodes in her neck are tender.",
    glossary: { "tonsils": "amígdalas", "lymph nodes": "linfonodos", "swallows": "engole", "tender": "doloroso à palpação" },
    questions: [
      { q: "How long has she had the symptoms?", options: ["One day", "Three days", "One week", "One month"], a: 1 },
      { q: "When does it hurt?", options: ["When she walks", "When she swallows", "When she sleeps", "When she coughs"], a: 1 },
      { q: "What is on her tonsils?", options: ["White spots", "Blood", "A bruise", "Nothing"], a: 0 }
    ]
  },
  {
    id: "c2", title: "The fall", level: "Fácil", topic: "radiography",
    text: "An 80-year-old woman fell at home. She cannot stand up and has severe pain in her right hip. Her right leg looks shorter and is rotated outwards. The doctor requests an X-ray of the pelvis and hip, which shows a fracture of the neck of the femur. She is referred to the orthopedic surgeon.",
    glossary: { "fell": "caiu", "shorter": "mais curta", "rotated outwards": "rodada para fora", "referred": "encaminhada", "femur": "fêmur" },
    questions: [
      { q: "Where is the pain?", options: ["Right knee", "Right hip", "Left shoulder", "Back"], a: 1 },
      { q: "What does the X-ray show?", options: ["A dislocation", "A fracture", "Nothing", "Pneumonia"], a: 1 },
      { q: "Who will see her next?", options: ["A cardiologist", "An orthopedic surgeon", "A dermatologist", "A pharmacist"], a: 1 }
    ]
  },
  {
    id: "c3", title: "Thirsty all the time", level: "Fácil", topic: "lab",
    text: "A 45-year-old man says he is thirsty all the time and pees a lot, even at night. He has also lost weight without trying. He is overweight and his father has diabetes. His fasting blood sugar is 160 mg/dL. The doctor explains the diagnosis of type 2 diabetes and talks about diet, exercise and medication.",
    glossary: { "thirsty": "com sede", "without trying": "sem tentar", "overweight": "acima do peso", "fasting": "em jejum" },
    questions: [
      { q: "What are his symptoms?", options: ["Thirst and peeing a lot", "Cough and fever", "Chest pain", "Headache"], a: 0 },
      { q: "Who in his family has diabetes?", options: ["His mother", "His father", "His brother", "Nobody"], a: 1 },
      { q: "What is the diagnosis?", options: ["Type 1 diabetes", "Type 2 diabetes", "Kidney stone", "Anemia"], a: 1 }
    ]
  },
  {
    id: "c4", title: "Chest pain at the gym", level: "Médio", topic: "cardio",
    text: "A 58-year-old man is brought to the emergency room. He felt a tight, heavy chest pain while exercising at the gym. The pain radiates to his left arm and he is sweating. He smokes and has hypertension. The nurse does an ECG immediately. The ECG shows changes of an acute myocardial infarction, and the cardiology team is called.",
    glossary: { "tight": "aperto", "heavy": "em peso", "sweating": "suando", "brought": "trazido" },
    questions: [
      { q: "How does he describe the pain?", options: ["Sharp and burning", "Tight and heavy", "Itchy", "Mild"], a: 1 },
      { q: "Which risk factors does he have?", options: ["Smoking and hypertension", "Asthma", "Diabetes only", "None"], a: 0 },
      { q: "What test is done immediately?", options: ["An MRI", "An ECG", "A biopsy", "A urinalysis"], a: 1 }
    ]
  },
  {
    id: "c5", title: "The little boy with a rash", level: "Fácil", topic: "symptoms",
    text: "A 4-year-old boy has a fever and small red spots on his body. The spots became blisters and they are very itchy. Some children at his school have the same problem. He has not had the chickenpox vaccine. The doctor explains that it is chickenpox and recommends rest, fluids, paracetamol and keeping him at home until all the blisters dry.",
    glossary: { "blisters": "bolhas / vesículas", "itchy": "coçando", "chickenpox": "catapora / varicela", "dry": "secarem" },
    questions: [
      { q: "What did the spots become?", options: ["Bruises", "Blisters", "Wounds", "Burns"], a: 1 },
      { q: "What is the diagnosis?", options: ["Measles", "Chickenpox", "Allergy", "Sunburn"], a: 1 },
      { q: "When can he go back to school?", options: ["Tomorrow", "When all the blisters dry", "After one month", "Never"], a: 1 }
    ]
  },
  {
    id: "c6", title: "Headache and stiff neck", level: "Médio", topic: "neuro",
    text: "A 20-year-old student arrives at the emergency room with a severe headache, a high fever and vomiting. Light hurts her eyes and her neck is stiff. There are small purple spots on her legs. The team suspects bacterial meningitis. They take blood cultures, give antibiotics immediately and then perform a spinal tap.",
    glossary: { "stiff": "rígido", "light hurts her eyes": "fotofobia", "purple spots": "manchas roxas / petéquias", "suspects": "suspeita" },
    questions: [
      { q: "What does the team suspect?", options: ["Migraine", "Bacterial meningitis", "Stroke", "Flu"], a: 1 },
      { q: "What do they do before the spinal tap?", options: ["Give antibiotics", "Send her home", "Do an MRI", "Wait 24 hours"], a: 0 },
      { q: "Where are the purple spots?", options: ["On her face", "On her legs", "On her back", "On her hands"], a: 1 }
    ]
  },
  {
    id: "c7", title: "The swollen leg", level: "Médio", topic: "cardio",
    text: "A 35-year-old woman returned from a 12-hour flight two days ago. Now her left calf is painful, red and swollen. She takes the contraceptive pill. The doctor suspects a blood clot in a deep vein of the leg (deep vein thrombosis) and requests an ultrasound. The ultrasound confirms it, and she starts an anticoagulant.",
    glossary: { "flight": "voo", "contraceptive pill": "pílula anticoncepcional", "anticoagulant": "anticoagulante", "returned": "voltou" },
    questions: [
      { q: "Which part of the leg is swollen?", options: ["The thigh", "The calf", "The ankle", "The knee"], a: 1 },
      { q: "Which test confirms the diagnosis?", options: ["Ultrasound", "X-ray", "ECG", "Urinalysis"], a: 0 },
      { q: "What treatment does she start?", options: ["An antibiotic", "An anticoagulant", "A painkiller only", "Surgery"], a: 1 }
    ]
  },
  {
    id: "c8", title: "Renal colic", level: "Fácil", topic: "renal",
    text: "A 40-year-old man has a sudden, very strong pain in his right flank. The pain goes to his groin and comes in waves. He cannot stay still. He feels nauseous, and his urine is pink. A CT scan shows a small kidney stone. He receives painkillers and is told to drink a lot of water. The stone will probably pass on its own.",
    glossary: { "comes in waves": "vem em ondas (cólica)", "cannot stay still": "não consegue ficar parado", "pink": "rosada", "on its own": "sozinha" },
    questions: [
      { q: "Where does the pain go?", options: ["To the groin", "To the arm", "To the jaw", "To the head"], a: 0 },
      { q: "What color is his urine?", options: ["Yellow", "Pink", "Black", "Green"], a: 1 },
      { q: "What will probably happen to the stone?", options: ["It will pass on its own", "It needs surgery today", "It will grow", "Nothing"], a: 0 }
    ]
  }
];

/* Mensagens motivacionais (citações de Hipócrates usadas nos materiais). */
const QUOTES = [
  "“Wherever the art of medicine is loved, there is also a love of humanity.” — Hippocrates",
  "“It is far more important to know what person the disease has than what disease the person has.” — Hippocrates",
  "“As to diseases, make a habit of two things — to help, or at least, to do no harm.” — Hippocrates",
  "“If you are in a bad mood go for a walk. If you are still in a bad mood go for another walk.” — Hippocrates",
  "“Walking is man's best medicine.” — Hippocrates",
  "“Cure sometimes, treat often, comfort always.” — Hippocrates"
];

/* Recursos: fontes oficiais e materiais do manual “Como melhorar seu inglês médico”. */
const RESOURCES = [
  { group: "Fontes oficiais de saúde (em inglês)", items: [
    ["MedlinePlus – NIH/NLM", "https://medlineplus.gov/", "Informação de saúde em inglês simples, enciclopédia médica e vídeos de anatomia."],
    ["MedlinePlus – Understanding Medical Words", "https://medlineplus.gov/medicalwords.html", "Tutorial oficial de prefixos, sufixos e raízes."],
    ["NCI Dictionary of Cancer Terms", "https://www.cancer.gov/publications/dictionaries/cancer-terms", "Dicionário oficial do National Cancer Institute, com áudio."],
    ["World Health Organization – Fact sheets", "https://www.who.int/news-room/fact-sheets", "Textos curtos sobre doenças: ótimos para leitura."],
    ["CDC – Diseases & Conditions", "https://www.cdc.gov/", "Centers for Disease Control and Prevention."],
    ["NHS – Health A to Z", "https://www.nhs.uk/conditions/", "Inglês britânico, linguagem voltada ao paciente."],
    ["American Heart Association – CPR", "https://cpr.heart.org/", "Diretrizes de BLS/ACLS."]
  ]},
  { group: "Dicionários", items: [
    ["Cambridge Dictionary", "https://dictionary.cambridge.org", "Inglês geral, com áudio US/UK."],
    ["Oxford Learner's Dictionaries", "https://www.oxfordlearnersdictionaries.com/us", "Definições simples para estudantes."],
    ["Merriam-Webster Medical", "https://www.merriam-webster.com/medical", "Dicionário médico."],
    ["TheFreeDictionary – Medical", "https://medical-dictionary.thefreedictionary.com", "Dicionário médico."],
    ["Harvard Health – Medical Dictionary", "https://www.health.harvard.edu/medical-dictionary-of-health-terms/a-through-c", "Harvard Medical School."]
  ]},
  { group: "Pronúncia e tradução em contexto", items: [
    ["YouGlish", "https://youglish.com", "Ouça a palavra em vídeos reais do YouTube."],
    ["Forvo", "https://forvo.com", "Pronúncia gravada por falantes nativos."],
    ["Context Reverso", "https://context.reverso.net/traducao/", "Tradução com exemplos de frases."],
    ["Linguee", "https://www.linguee.com", "Tradução com exemplos."]
  ]},
  { group: "Vídeos, palestras e cursos", items: [
    ["MedlinePlus – Anatomy videos", "https://medlineplus.gov/anatomyvideos.html", "Vídeos curtos de anatomia."],
    ["TED-Ed", "https://ed.ted.com/", "Vídeos com transcrição e quiz."],
    ["Osmosis", "https://www.youtube.com/c/osmosis", "Medicina em inglês no YouTube."],
    ["Geeky Medics", "https://www.youtube.com/c/Geekymedics/videos", "Exame físico e OSCE em inglês."],
    ["Lecturio Medical", "https://www.youtube.com/c/Lecturio-Medical-Education-Videos", "Aulas de medicina em inglês."]
  ]},
  { group: "Nivelamento e inglês geral", items: [
    ["British Council – Level test", "https://learnenglish.britishcouncil.org/english-levels/online-english-level-test", "Teste gratuito (CEFR A1–C2)."],
    ["Cambridge – Test your English", "https://www.cambridgeenglish.org/test-your-english/", "Teste gratuito."],
    ["News in Levels", "https://www.newsinlevels.com/", "Notícias em três níveis de dificuldade."]
  ]},
  { group: "Podcasts e séries para treinar o ouvido", items: [
    ["The Curbsiders", "https://thecurbsiders.com/", "Podcast de clínica médica."],
    ["Behind the Knife", "https://behindtheknife.org/", "Podcast de cirurgia."],
    ["Séries", "", "Grey's Anatomy, ER, Scrubs, The Good Doctor, Chicago Med, House M.D. — assista com legenda em inglês."]
  ]}
];
