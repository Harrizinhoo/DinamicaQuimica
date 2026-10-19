/**
 * DINÁMICA QUÍMICA & BIOLÓGICA: LA MAZMORRA DE LA VIDA
 * Lógica principal, Sintetizador de Audio Web, 15 Niveles, Skins SVG y Animaciones Biológicas
 */

// ============================================================================
// 1. SINTETIZADOR DE SONIDO INTEGRADO (Web Audio API - Cero archivos externos)
// ============================================================================
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, type, duration, startTime = 0, vol = 0.18) {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime + startTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + duration);
    }

    // Sonido de Rayo Eléctrico de alto voltaje + fanfarria al acertar
    playSwordAndTriumph() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;

        // 1. Descarga de Rayo Eléctrico (barrido de alta frecuencia + chispas)
        for (let i = 0; i < 6; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = i % 2 === 0 ? "sawtooth" : "square";
            const startF = 1400 - i * 160;
            osc.frequency.setValueAtTime(startF, now + i * 0.045);
            osc.frequency.exponentialRampToValueAtTime(140, now + i * 0.045 + 0.09);
            gain.gain.setValueAtTime(0.18, now + i * 0.045);
            gain.gain.exponentialRampToValueAtTime(0.005, now + i * 0.045 + 0.095);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.045);
            osc.stop(now + i * 0.045 + 0.1);
        }

        // 2. Acorde de triunfo heroico tras electrocutar al contrincante
        this.playTone(523.25, "triangle", 0.25, 0.28, 0.2); // C5
        this.playTone(659.25, "triangle", 0.25, 0.40, 0.2); // E5
        this.playTone(783.99, "triangle", 0.45, 0.52, 0.24); // G5
        this.playTone(1046.50, "sine", 0.55, 0.64, 0.22); // C6
    }

    // Sonido de impacto explosivo tipo SMASH contra la armadura cuando el jugador se equivoca
    playDamageHit() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;

        // Golpe grave de impacto Smash + timbre metálico de armadura
        this.playTone(68, "sawtooth", 0.45, 0, 0.35);
        this.playTone(115, "square", 0.35, 0.02, 0.3);
        this.playTone(880, "triangle", 0.14, 0, 0.22); // Clank metálico inicial

        const crunchOsc = this.ctx.createOscillator();
        const crunchGain = this.ctx.createGain();
        crunchOsc.type = "sawtooth";
        crunchOsc.frequency.setValueAtTime(320, now);
        crunchOsc.frequency.exponentialRampToValueAtTime(38, now + 0.38);
        crunchGain.gain.setValueAtTime(0.32, now);
        crunchGain.gain.exponentialRampToValueAtTime(0.005, now + 0.4);
        crunchOsc.connect(crunchGain);
        crunchGain.connect(this.ctx.destination);
        crunchOsc.start(now);
        crunchOsc.stop(now + 0.42);
    }

    // Sonido mágico de poción / curación
    playPotionHeal() {
        if (!this.enabled) return;
        this.init();
        const notes = [440, 554.37, 659.25, 880, 1108.73];
        notes.forEach((n, idx) => {
            this.playTone(n, 'sine', 0.22, idx * 0.07, 0.18);
        });
    }

    // Sonido de puerta antigua de piedra abriéndose
    playDungeonGate() {
        if (!this.enabled) return;
        this.init();
        this.playTone(85, 'sawtooth', 0.7, 0, 0.18);
        this.playTone(110, 'triangle', 0.6, 0.2, 0.16);
        this.playTone(220, 'sine', 0.5, 0.5, 0.15);
    }

    // Fanfarria final de victoria contra el Golem
    playGrandVictory() {
        if (!this.enabled) return;
        this.init();
        const melody = [
            { f: 523.25, t: 0, d: 0.2 },
            { f: 523.25, t: 0.22, d: 0.2 },
            { f: 523.25, t: 0.44, d: 0.2 },
            { f: 659.25, t: 0.66, d: 0.4 },
            { f: 587.33, t: 1.1, d: 0.3 },
            { f: 659.25, t: 1.45, d: 0.3 },
            { f: 783.99, t: 1.8, d: 0.8 }
        ];
        melody.forEach(m => this.playTone(m.f, 'triangle', m.d, m.t, 0.22));
    }
}

const sfx = new SoundEngine();

// ============================================================================
// 2. BANCO OFICIAL DE 15 NIVELES CONSECUTIVOS Y ANIMACIONES BIOLÓGICAS
// ============================================================================
const DUNGEON_LEVELS = [
    {
        level: 1,
        biomeId: 1,
        actTitle: "Acto I · El pantano de los microorganismos",
        mission: "Misión: cruzar el pantano sin caer en las trampas bacterianas.",
        questionTitle: "Pregunta 1 — Ataque microbiano",
        narrative: "El héroe encuentra una puerta cubierta de bacterias. Una voz le pregunta: ¿cuál de estas afirmaciones sobre las bacterias es correcta?",
        options: {
            A: "Todas las bacterias causan enfermedades.",
            B: "Algunas bacterias son beneficiosas y participan en la elaboración de alimentos.",
            C: "Las bacterias son organismos pluricelulares."
        },
        correct: "B",
        explanation: "Las bacterias son microorganismos unicelulares procariotas; muchas son benéficas para la flora intestinal y procesos industriales alimentarios.",
        playerAction: "⚡ Acción: ¡Utilizas el poder de la fermentación bioquímica para purificar y abrir la puerta del pantano!",
        enemyName: "Colonia Patógena del Pantano",
        enemyType: "bacteria",
        conceptTitle: "Muestra Visual · Nivel 1",
        rewardType: "none"
    },
    {
        level: 2,
        biomeId: 1,
        actTitle: "Acto I · El pantano de los microorganismos",
        mission: "Misión: cruzar el pantano sin caer en las trampas bacterianas.",
        questionTitle: "Pregunta 2 — El laboratorio secreto",
        narrative: "El héroe necesita identificar un microorganismo que transforma la leche en yogur.",
        options: {
            A: "Una bacteria láctica.",
            B: "Un insecto.",
            C: "Un virus que realiza fotosíntesis."
        },
        correct: "A",
        explanation: "Las bacterias lácticas (como Lactobacillus) participan en la fermentación de la lactosa de la leche convirtiéndola en ácido láctico para formar yogur.",
        playerAction: "🧪 Acción: ¡Sintetizas un Elixir Láctico en el laboratorio secreto y recibes +1 Poción de Salud!",
        enemyName: "Alquimista de Esporas",
        enemyType: "slime",
        conceptTitle: "Muestra Visual · Nivel 2",
        rewardType: "potion"
    },
    {
        level: 3,
        biomeId: 2,
        actTitle: "Acto II · El bosque de las alianzas simbióticas",
        mission: "Misión: conseguir la ayuda de las criaturas del bosque.",
        questionTitle: "Pregunta 3 — La alianza de supervivencia",
        narrative: "El héroe encuentra un pez payaso entre los tentáculos de una anémona. ¿Qué tipo de relación puede existir entre ellos?",
        options: {
            A: "Mutualismo: ambos obtienen beneficios.",
            B: "Competencia: luchan siempre por el mismo recurso.",
            C: "Depredación: uno necesariamente se come al otro."
        },
        correct: "A",
        explanation: "En esta relación, el pez puede obtener protección y la anémona puede beneficiarse de la interacción, aunque sus beneficios concretos varían según la especie y las condiciones.",
        playerAction: "🛡️ Acción: ¡Consigues un Aliado Simbiótico que activa un Escudo Protector para bloquear el próximo daño!",
        enemyName: "Acechador de Arrecife",
        enemyType: "plantMonster",
        conceptTitle: "Muestra Visual · Nivel 3",
        rewardType: "shield"
    },
    {
        level: 4,
        biomeId: 2,
        actTitle: "Acto II · El bosque de las alianzas simbióticas",
        mission: "Misión: conseguir la ayuda de las criaturas del bosque.",
        questionTitle: "Pregunta 4 — El árbol enfermo",
        narrative: "El héroe observa líquenes creciendo sobre una roca. ¿Qué organismos forman un liquen?",
        options: {
            A: "Un hongo y un alga o una cianobacteria.",
            B: "Dos animales.",
            C: "Una planta y un insecto."
        },
        correct: "A",
        explanation: "Ambos componentes mantienen una asociación simbiótica: el hongo aporta humedad/soporte y el alga o cianobacteria aporta nutrientes fotosintéticos.",
        playerAction: "🌿 Acción: ¡Los líquenes iluminan las rocas, descubres una ruta secreta en el bosque y avanzas con éxito!",
        enemyName: "Ente de Corteza Gris",
        enemyType: "plantMonster",
        conceptTitle: "Muestra Visual · Nivel 4",
        rewardType: "none"
    },
    {
        level: 5,
        biomeId: 3,
        actTitle: "Acto III · El reino del ecosistema",
        mission: "Misión: restaurar el equilibrio de un reino natural.",
        questionTitle: "Pregunta 5 — El río contaminado",
        narrative: "Un río recibe tantos contaminantes que disminuye la cantidad de peces. ¿Qué consecuencia podría tener esto sobre el ecosistema?",
        options: {
            A: "Disminuiría el ciclo monetario al no recibir visitantes por falta de peces.",
            B: "Puede alterar las cadenas alimentarias y las poblaciones de otras especies.",
            C: "Todos los organismos se reproducen más rápido."
        },
        correct: "B",
        explanation: "Los ecosistemas están interconectados; la pérdida de una población altera la disponibilidad de alimento y el equilibrio trófico general.",
        playerAction: "💧 Acción: ¡Activas el Poder de Restauración del Río, purificando las aguas y obteniendo +1 Poción Purificadora!",
        enemyName: "Hidra de Lodo Tóxico",
        enemyType: "slime",
        conceptTitle: "Muestra Visual · Nivel 5",
        rewardType: "potion"
    },
    {
        level: 6,
        biomeId: 3,
        actTitle: "Acto III · El reino del ecosistema",
        mission: "Misión: restaurar el equilibrio de un reino natural.",
        questionTitle: "Pregunta 6 — La cadena alimentaria",
        narrative: "El héroe debe identificar al productor de esta cadena: Hierba → saltamontes → rana → serpiente",
        options: {
            A: "La rana.",
            B: "La serpiente.",
            C: "La hierba."
        },
        correct: "C",
        explanation: "La hierba produce su propio alimento mediante la fotosíntesis, transformando energía solar e inorgánica en materia orgánica.",
        playerAction: "🗺️ Acción: ¡Restauras el flujo trófico y desbloqueas el mapa hacia el Castillo de la Genética!",
        enemyName: "Víbora de la Cadena",
        enemyType: "serpent",
        conceptTitle: "Muestra Visual · Nivel 6",
        rewardType: "none"
    },
    {
        level: 7,
        biomeId: 4,
        actTitle: "Acto IV · El castillo de la genética",
        mission: "Misión: descifrar los códigos genéticos de una puerta encantada.",
        questionTitle: "Pregunta 7 — El código oculto",
        narrative: "El guardián pregunta: ¿qué función cumplen los genes?",
        options: {
            A: "Contienen información que contribuye a determinar características y funciones del organismo.",
            B: "Transportan únicamente oxígeno por la sangre.",
            C: "Son órganos encargados de digerir los alimentos."
        },
        correct: "A",
        explanation: "Los genes son segmentos de ADN que almacenan la información hereditaria para sintetizar proteínas y regular las características biológicas.",
        playerAction: "🧬 Acción: ¡Descifras la doble hélice del código oculto y abres la cámara secreta del castillo!",
        enemyName: "Centinela del Cromosoma",
        enemyType: "specter",
        conceptTitle: "Muestra Visual · Nivel 7",
        rewardType: "none"
    },
    {
        level: 8,
        biomeId: 4,
        actTitle: "Acto IV · El castillo de la genética",
        mission: "Misión: descifrar los códigos genéticos de una puerta encantada.",
        questionTitle: "Pregunta 8 — La herencia del dragón",
        narrative: "En una criatura imaginaria, el alelo para escamas doradas (D) es dominante sobre el de escamas plateadas (d). Si cruza una criatura Dd con otra dd, ¿Qué proporción de descendientes se espera con escamas doradas?",
        options: {
            A: "100 %.",
            B: "50 %.",
            C: "0 %."
        },
        correct: "B",
        explanation: "Se espera un 50 % con genotipo Dd y escamas doradas, y un 50 % con genotipo dd y escamas plateadas, suponiendo dominancia completa.",
        playerAction: "🐉 Acción: ¡Obtienes la habilidad ancestral de predecir rasgos hereditarios y forjas +1 Poción Dracónica!",
        enemyName: "Dragón Quimérico Dd",
        enemyType: "dragon",
        conceptTitle: "Muestra Visual · Nivel 8",
        rewardType: "potion"
    },
    {
        level: 9,
        biomeId: 5,
        actTitle: "Acto V · El desierto de los ciclos biogeoquímicos",
        mission: "Misión: recuperar el agua y los nutrientes del desierto.",
        questionTitle: "Pregunta 9 — La fuente desaparecida",
        narrative: "El héroe encuentra un lago seco y debe explicar cómo el agua regresa a la atmósfera.",
        options: {
            A: "Por evaporación.",
            B: "Por organismos descomponedores.",
            C: "Por Fotosintesis."
        },
        correct: "A",
        explanation: "El agua pasa a vapor mediante la evaporación solar y también llega a la atmósfera por la transpiración de las plantas.",
        playerAction: "⛲ Acción: ¡Activas la fuente sagrada del oasis y recuperas +1 Punto de Vida inmediatamente (máx. 5)!",
        enemyName: "Espectro de la Sequía",
        enemyType: "elemental",
        conceptTitle: "Muestra Visual · Nivel 9",
        rewardType: "instantHeal"
    },
    {
        level: 10,
        biomeId: 5,
        actTitle: "Acto V · El desierto de los ciclos biogeoquímicos",
        mission: "Misión: recuperar el agua y los nutrientes del desierto.",
        questionTitle: "Pregunta 10 — El enigma del carbono",
        narrative: "Los árboles absorben dióxido de carbono durante la fotosíntesis. ¿A qué ciclo natural pertenece este proceso?",
        options: {
            A: "Al ciclo del carbono.",
            B: "Al ciclo de las rocas.",
            C: "Al ciclo del Nitrógeno."
        },
        correct: "A",
        explanation: "La fijación fotosintética de CO₂ atmosférico por los organismos autótrofos es un pilar fundamental del ciclo biogeoquímico del carbono.",
        playerAction: "💎 Acción: ¡Consigues la Piedra de Energía del Carbono para potenciar tu espada frente al Guardián!",
        enemyName: "Coloso de Arena Ígnea",
        enemyType: "elemental",
        conceptTitle: "Muestra Visual · Nivel 10",
        rewardType: "stone"
    },
    {
        level: 11,
        biomeId: 6,
        actTitle: "Acto VI · La torre del sistema nervioso",
        mission: "Misión: superar trampas que reaccionan a los movimientos del héroe.",
        questionTitle: "Pregunta 11 — La trampa eléctrica",
        narrative: "Una flecha se dirige hacia el héroe. ¿Qué estructura del sistema nervioso central procesa la información y participa en la coordinación de los movimientos voluntarios?",
        options: {
            A: "El cerebelo.",
            B: "El lobulo temporal.",
            C: "La cornea."
        },
        correct: "A",
        explanation: "El cerebelo ayuda a coordinar la precisión de los movimientos voluntarios, el equilibrio y la postura corporal.",
        playerAction: "⚡ Acción: ¡Tu cerebelo coordina un giro acrobático perfecto, esquivas la trampa eléctrica y continúas!",
        enemyName: "Autómata Sináptico",
        enemyType: "specter",
        conceptTitle: "Muestra Visual · Nivel 11",
        rewardType: "none"
    },
    {
        level: 12,
        biomeId: 6,
        actTitle: "Acto VI · La torre del sistema nervioso",
        mission: "Misión: superar trampas que reaccionan a los movimientos del héroe.",
        questionTitle: "Pregunta 12 — El puente peligroso",
        narrative: "El héroe toca accidentalmente una superficie muy caliente y retira la mano rápidamente. ¿Qué estructura es fundamental para coordinar muchos reflejos de retirada?",
        options: {
            A: "La médula espinal.",
            B: "La piel.",
            C: "La dermis."
        },
        correct: "A",
        explanation: "La médula espinal coordina muchos reflejos rápidos mediante el arco reflejo antes de que el estímulo doloroso sea procesado conscientemente en el encéfalo.",
        playerAction: "🔥 Acción: ¡Tu arco reflejo medular reacciona al instante y superas el puente ardiente sin recibir daño!",
        enemyName: "Señor de los Impulsos",
        enemyType: "specter",
        conceptTitle: "Muestra Visual · Nivel 12",
        rewardType: "none"
    },
    {
        level: 13,
        biomeId: 7,
        actTitle: "Acto VII · La cueva de las adaptaciones morfológicas",
        mission: "Misión: identificar las características físicas que permiten sobrevivir a distintas especies.",
        questionTitle: "Pregunta 13 — El vuelo del murciélago",
        narrative: "El héroe encuentra un murciélago que sale de una cueva. ¿Qué característica morfológica le permite volar?",
        options: {
            A: "Sus extremidades anteriores modificadas para formar alas.",
            B: "Sus branquias.",
            C: "El desarrollo de tendones especializados."
        },
        correct: "A",
        explanation: "Los murciélagos son los únicos mamíferos con vuelo activo gracias al alargamiento de los huesos de sus dedos unidos por una membrana llamada patagio.",
        playerAction: "🦇 Acción: ¡Obtienes Alas Mágicas Quirópteras temporales para atravesar volando el precipicio abisal!",
        enemyName: "Vampiro Quiróptero Alfa",
        enemyType: "bat",
        conceptTitle: "Muestra Visual · Nivel 13",
        rewardType: "wings"
    },
    {
        level: 14,
        biomeId: 7,
        actTitle: "Acto VII · La cueva de las adaptaciones morfológicas",
        mission: "Misión: identificar las características físicas que permiten sobrevivir a distintas especies.",
        questionTitle: "Pregunta 14 — El pez de las profundidades",
        narrative: "El héroe descubre un pez adaptado a vivir en el agua. ¿Qué estructura le permite extraer oxígeno disuelto en ella?",
        options: {
            A: "Las branquias.",
            B: "Las escamas.",
            C: "Estructura Osea."
        },
        correct: "A",
        explanation: "Las branquias son estructuras laminares altamente vascularizadas especializadas para el intercambio de gases (O₂ y CO₂) en el medio acuático.",
        playerAction: "🗝️ Acción: ¡Sumerges tu mano en el abismo, encuentras la Última Llave Dorada y desbloqueas la sala del Jefe Final!",
        enemyName: "Leviatán Abisal",
        enemyType: "serpent",
        conceptTitle: "Muestra Visual · Nivel 14",
        rewardType: "key"
    },
    {
        level: 15,
        biomeId: 8,
        actTitle: "JEFE FINAL · El Guardián de la Vida",
        mission: "Misión Final: El guardián protege el tesoro y lanza una última prueba sobre los 7 temas.",
        questionTitle: "Pregunta 15 — El desafío definitivo",
        narrative: "Un bosque pierde gran parte de sus árboles. ¿Cuál de las siguientes opciones explica mejor dos consecuencias posibles?",
        options: {
            A: "Disminuye la captura de carbono por fotosíntesis y pueden perderse hábitats.",
            B: "Aumenta automáticamente la biodiversidad y se elimina la contaminación.",
            C: "Los ciclos del agua y del carbono dejan de existir por completo."
        },
        correct: "A",
        explanation: "La deforestación reduce drásticamente la biomasa fotosintética que fija CO₂ y destruye los nichos ecológicos donde habitan miles de especies.",
        playerAction: "🏆 Acción Final: ¡Derrotas al colosal Golem Guardián de la Vida con tu espada rúnica, abres el Cofre Ancestral y ganas la partida!",
        enemyName: "GOLEM GUARDIÁN DE LA VIDA",
        enemyType: "bossGolem",
        conceptTitle: "Muestra Visual · Nivel 15",
        rewardType: "victory"
    }
];

// ============================================================================
// 3. GENERADOR DE DIAGRAMA BIOLÓGICO ANIMADO (15 Ilustraciones Gráficas Puros sin Spoilers)
// ============================================================================
function getBiologicalConceptSVG(levelNum) {
    switch (levelNum) {
        case 1: // Ilustración gráfica pura: Microorganismo
            return `
            <svg viewBox="0 0 280 180">
                <defs>
                    <radialGradient id="bacGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#34d399"/>
                        <stop offset="100%" stop-color="#059669"/>
                    </radialGradient>
                </defs>
                <!-- Bacilo principal animado sin texto -->
                <g transform="translate(0, 12)">
                    <animateTransform attributeName="transform" type="translate" values="0,12; 0,4; 0,12" dur="2.5s" repeatCount="indefinite"/>
                    <rect x="65" y="55" width="120" height="55" rx="27" fill="url(#bacGrad)" stroke="#a7f3d0" stroke-width="3"/>
                    <path d="M95 82 Q110 65 125 82 T155 82 Q140 98 125 82 Z" fill="none" stroke="#fef08a" stroke-width="2.5"/>
                    <circle cx="85" cy="75" r="3" fill="#fff"/>
                    <circle cx="165" cy="88" r="3" fill="#fff"/>
                    <circle cx="115" cy="95" r="2.5" fill="#fff"/>
                    <path d="M185 75 Q215 60 235 80 T265 75" fill="none" stroke="#6ee7b7" stroke-width="2.5">
                        <animate attributeName="d" values="M185 75 Q215 60 235 80 T265 75; M185 75 Q215 95 235 70 T265 85; M185 75 Q215 60 235 80 T265 75" dur="0.8s" repeatCount="indefinite"/>
                    </path>
                    <path d="M185 90 Q215 105 240 85 T265 95" fill="none" stroke="#6ee7b7" stroke-width="2">
                        <animate attributeName="d" values="M185 90 Q215 105 240 85 T265 95; M185 90 Q215 70 240 100 T265 85; M185 90 Q215 105 240 85 T265 95" dur="0.9s" repeatCount="indefinite"/>
                    </path>
                </g>
            </svg>`;

        case 2: // Ilustración gráfica pura: Matraz -> Microorganismo -> Envase
            return `
            <svg viewBox="0 0 280 180">
                <!-- Matraz izquierdo -->
                <rect x="30" y="55" width="60" height="75" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
                <path d="M34 85 Q60 80 86 85 L86 126 L34 126 Z" fill="#e2e8f0"/>
                <!-- Flecha central con microorganismo sin etiquetas de texto -->
                <path d="M102 92 L168 92" stroke="#fbbf24" stroke-width="3" stroke-dasharray="5,3"/>
                <polygon points="168,86 180,92 168,98" fill="#fbbf24"/>
                <g>
                    <animateTransform attributeName="transform" type="translate" values="0,-4; 0,4; 0,-4" dur="1.6s" repeatCount="indefinite"/>
                    <rect x="115" y="52" width="45" height="20" rx="10" fill="#10b981" stroke="#fff" stroke-width="1.5"/>
                    <circle cx="128" cy="62" r="2.5" fill="#d1fae5"/>
                    <circle cx="146" cy="62" r="2.5" fill="#d1fae5"/>
                </g>
                <!-- Envase derecho -->
                <path d="M190 60 L250 60 L242 130 L198 130 Z" fill="#fbcfe8" stroke="#ec4899" stroke-width="2.5"/>
                <ellipse cx="220" cy="60" rx="30" ry="6" fill="#f9a8d4" stroke="#ec4899" stroke-width="2"/>
            </svg>`;

        case 3: // Ilustración gráfica pura: Pez payaso y anémona
            return `
            <svg viewBox="0 0 280 180">
                <g stroke="#ec4899" stroke-width="8" stroke-linecap="round" fill="none">
                    <path d="M70 155 Q60 110 75 75"><animate attributeName="d" values="M70 155 Q60 110 75 75; M70 155 Q85 110 65 75; M70 155 Q60 110 75 75" dur="2.2s" repeatCount="indefinite"/></path>
                    <path d="M100 155 Q95 100 105 65"><animate attributeName="d" values="M100 155 Q95 100 105 65; M100 155 Q115 100 95 65; M100 155 Q95 100 105 65" dur="2.5s" repeatCount="indefinite"/></path>
                    <path d="M135 155 Q145 105 130 68"><animate attributeName="d" values="M135 155 Q145 105 130 68; M135 155 Q120 105 145 68; M135 155 Q145 105 130 68" dur="2s" repeatCount="indefinite"/></path>
                    <path d="M170 155 Q185 110 165 72"><animate attributeName="d" values="M170 155 Q185 110 165 72; M170 155 Q160 110 185 72; M170 155 Q185 110 165 72" dur="2.4s" repeatCount="indefinite"/></path>
                    <path d="M200 155 Q215 115 195 80"><animate attributeName="d" values="M200 155 Q215 115 195 80; M200 155 Q190 115 210 80; M200 155 Q215 115 195 80" dur="2.1s" repeatCount="indefinite"/></path>
                </g>
                <rect x="55" y="148" width="160" height="22" rx="10" fill="#9d174d"/>
                <g>
                    <animateTransform attributeName="transform" type="translate" values="0,0; 22,-8; 0,0" dur="3s" repeatCount="indefinite"/>
                    <ellipse cx="130" cy="95" rx="28" ry="16" fill="#f97316" stroke="#fff" stroke-width="1.5"/>
                    <path d="M120 79 L120 111 M140 81 L140 109" stroke="#ffffff" stroke-width="5"/>
                    <polygon points="98,95 84,83 84,107" fill="#f97316"/>
                    <circle cx="148" cy="91" r="2.5" fill="#000"/>
                </g>
            </svg>`;

        case 4: // Ilustración gráfica pura: Liquen sobre roca sin textos explicativos
            return `
            <svg viewBox="0 0 280 180">
                <!-- Capa superior filamentosa -->
                <rect x="35" y="38" width="210" height="24" rx="8" fill="#a16207" stroke="#fde047" stroke-width="1.5"/>
                <path d="M45 62 L65 82 M95 62 L115 82 M145 62 L165 82 M195 62 L215 82" stroke="#fde047" stroke-width="2"/>
                <!-- Esferas verdes entrelazadas -->
                <g>
                    <circle cx="65" cy="88" r="14" fill="#22c55e" stroke="#bbf7d0" stroke-width="2">
                        <animate attributeName="r" values="13;15;13" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="115" cy="88" r="14" fill="#22c55e" stroke="#bbf7d0" stroke-width="2">
                        <animate attributeName="r" values="15;13;15" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="165" cy="88" r="14" fill="#22c55e" stroke="#bbf7d0" stroke-width="2">
                        <animate attributeName="r" values="13;15;13" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="215" cy="88" r="14" fill="#22c55e" stroke="#bbf7d0" stroke-width="2">
                        <animate attributeName="r" values="15;13;15" dur="2s" repeatCount="indefinite"/>
                    </circle>
                </g>
                <!-- Base rocosa -->
                <rect x="35" y="122" width="210" height="32" rx="6" fill="#475569" stroke="#64748b" stroke-width="1.5"/>
            </svg>`;

        case 5: // Ilustración gráfica pura: Río con gotas contaminantes y peces
            return `
            <svg viewBox="0 0 280 180">
                <path d="M15 95 Q75 80 140 95 T265 95 L265 160 L15 160 Z" fill="#0284c7" opacity="0.78"/>
                <circle cx="80" cy="45" r="7" fill="#a855f7">
                    <animate attributeName="cy" values="25;115;25" dur="2.2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="145" cy="35" r="6" fill="#84cc16">
                    <animate attributeName="cy" values="20;125;20" dur="1.8s" repeatCount="indefinite"/>
                </circle>
                <circle cx="205" cy="40" r="6.5" fill="#a855f7">
                    <animate attributeName="cy" values="28;118;28" dur="2.5s" repeatCount="indefinite"/>
                </circle>
                <g transform="translate(175, 118)">
                    <ellipse cx="20" cy="12" rx="18" ry="9" fill="#38bdf8" stroke="#fff" stroke-width="1.5"/>
                    <polygon points="0,12 -10,4 -10,20" fill="#38bdf8"/>
                    <circle cx="28" cy="10" r="2" fill="#0f172a"/>
                </g>
            </svg>`;

        case 6: // Ilustración gráfica pura: Hierba -> saltamontes -> rana -> serpiente
            return `
            <svg viewBox="0 0 280 180">
                <circle cx="35" cy="38" r="16" fill="#facc15">
                    <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite"/>
                </circle>
                <!-- 1. Hierba -->
                <g transform="translate(22, 82)">
                    <rect x="0" y="0" width="52" height="52" rx="8" fill="#065f46" stroke="#34d399" stroke-width="2"/>
                    <path d="M16 40 Q20 15 14 10 M26 40 Q26 12 28 8 M36 40 Q32 18 40 12" stroke="#4ade80" stroke-width="3" fill="none"/>
                </g>
                <polygon points="78,104 88,108 78,112" fill="#fbbf24"/>
                <!-- 2. Saltamontes -->
                <g transform="translate(96, 82)">
                    <rect x="0" y="0" width="46" height="52" rx="8" fill="#1e293b" stroke="#64748b"/>
                    <ellipse cx="23" cy="28" rx="14" ry="7" fill="#84cc16"/>
                </g>
                <polygon points="146,104 156,108 146,112" fill="#fbbf24"/>
                <!-- 3. Rana -->
                <g transform="translate(162, 82)">
                    <rect x="0" y="0" width="46" height="52" rx="8" fill="#1e293b" stroke="#64748b"/>
                    <circle cx="23" cy="28" r="12" fill="#22c55e"/>
                </g>
                <polygon points="212,104 222,108 212,112" fill="#fbbf24"/>
                <!-- 4. Serpiente -->
                <g transform="translate(226, 82)">
                    <rect x="0" y="0" width="44" height="52" rx="8" fill="#1e293b" stroke="#64748b"/>
                    <path d="M10 36 Q22 12 34 26" stroke="#f97316" stroke-width="4" fill="none" stroke-linecap="round"/>
                </g>
            </svg>`;

        case 7: // Ilustración gráfica pura: Doble hélice de ADN sin texto
            return `
            <svg viewBox="0 0 280 180">
                <g transform="translate(0, 15)">
                    <g stroke-width="3.5" fill="none">
                        <path d="M40 60 Q90 20 140 60 T240 60" stroke="#38bdf8">
                            <animate attributeName="d" values="M40 60 Q90 20 140 60 T240 60; M40 60 Q90 100 140 60 T240 60; M40 60 Q90 20 140 60 T240 60" dur="3s" repeatCount="indefinite"/>
                        </path>
                        <path d="M40 90 Q90 130 140 90 T240 90" stroke="#ec4899">
                            <animate attributeName="d" values="M40 90 Q90 130 140 90 T240 90; M40 90 Q90 50 140 90 T240 90; M40 90 Q90 130 140 90 T240 90" dur="3s" repeatCount="indefinite"/>
                        </path>
                    </g>
                    <line x1="70" y1="50" x2="70" y2="100" stroke="#fbbf24" stroke-width="2.5"/>
                    <line x1="105" y1="55" x2="105" y2="95" stroke="#34d399" stroke-width="2.5"/>
                    <line x1="140" y1="60" x2="140" y2="90" stroke="#fbbf24" stroke-width="2.5"/>
                    <line x1="175" y1="55" x2="175" y2="95" stroke="#34d399" stroke-width="2.5"/>
                    <line x1="210" y1="50" x2="210" y2="100" stroke="#fbbf24" stroke-width="2.5"/>
                </g>
            </svg>`;

        case 8: // Ilustración gráfica pura: Dos escamas de dragón (Dorada y Plateada) sin revelar el resultado del cruce
            return `
            <svg viewBox="0 0 280 180">
                <g transform="translate(55, 45)">
                    <polygon points="35,0 70,35 35,85 0,35" fill="#fbbf24" stroke="#fef08a" stroke-width="2.5"/>
                    <polygon points="35,12 56,35 35,68 14,35" fill="#f59e0b"/>
                </g>
                <path d="M132 88 L148 88 M140 80 L140 96" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
                <g transform="translate(155, 45)">
                    <polygon points="35,0 70,35 35,85 0,35" fill="#94a3b8" stroke="#e2e8f0" stroke-width="2.5"/>
                    <polygon points="35,12 56,35 35,68 14,35" fill="#64748b"/>
                </g>
            </svg>`;

        case 9: // Ilustración gráfica pura: Lago, sol y nubes sin etiquetas de texto
            return `
            <svg viewBox="0 0 280 180">
                <circle cx="225" cy="40" r="20" fill="#facc15"/>
                <ellipse cx="140" cy="148" rx="95" ry="20" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
                <g stroke="#bae6fd" stroke-width="3" fill="none" stroke-linecap="round">
                    <path d="M95 130 Q85 95 95 65"/>
                    <path d="M140 130 Q130 95 140 60"/>
                    <path d="M185 130 Q175 95 185 65"/>
                </g>
                <polygon points="95,55 89,67 101,67" fill="#bae6fd"/>
                <polygon points="140,50 134,62 146,62" fill="#bae6fd"/>
                <polygon points="185,55 179,67 191,67" fill="#bae6fd"/>
                <path d="M85 45 C85 30, 115 25, 130 35 C145 22, 180 28, 180 45 Z" fill="#e2e8f0"/>
            </svg>`;

        case 10: // Ilustración gráfica pura: Árbol con partículas entrando y saliendo (sin texto de Carbono/CO2)
            return `
            <svg viewBox="0 0 280 180">
                <rect x="130" y="108" width="20" height="52" fill="#78350f"/>
                <circle cx="140" cy="82" r="38" fill="#16a34a" stroke="#4ade80" stroke-width="2"/>
                <circle cx="115" cy="94" r="24" fill="#15803d"/>
                <circle cx="165" cy="94" r="24" fill="#15803d"/>
                <g>
                    <animateTransform attributeName="transform" type="translate" values="-12,0; 12,4; -12,0" dur="2.5s" repeatCount="indefinite"/>
                    <circle cx="48" cy="68" r="8" fill="#38bdf8"/>
                    <circle cx="34" cy="68" r="5" fill="#94a3b8"/>
                    <circle cx="62" cy="68" r="5" fill="#94a3b8"/>
                    <path d="M72 68 L92 68" stroke="#38bdf8" stroke-width="2.5"/>
                </g>
                <g>
                    <animateTransform attributeName="transform" type="translate" values="0,0; 14,-4; 0,0" dur="2.5s" repeatCount="indefinite"/>
                    <path d="M188 68 L208 68" stroke="#34d399" stroke-width="2.5"/>
                    <circle cx="222" cy="68" r="6" fill="#34d399"/>
                    <circle cx="234" cy="68" r="6" fill="#34d399"/>
                </g>
            </svg>`;

        case 11: // Ilustración gráfica pura: Silueta del encéfalo sin nombres ni textos
            return `
            <svg viewBox="0 0 280 180">
                <g transform="translate(0, 10)">
                    <path d="M75 95 C65 50, 125 25, 165 35 C205 42, 215 80, 190 105 L105 105 Z" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
                    <ellipse cx="178" cy="115" rx="28" ry="18" fill="#ec4899" stroke="#fbcfe8" stroke-width="2.5">
                        <animate attributeName="rx" values="27;31;27" dur="1.4s" repeatCount="indefinite"/>
                    </ellipse>
                    <rect x="132" y="105" width="16" height="45" rx="5" fill="#64748b"/>
                </g>
            </svg>`;

        case 12: // Ilustración gráfica pura: Llama e impulso reflejo sin etiquetas de texto
            return `
            <svg viewBox="0 0 280 180">
                <g transform="translate(0, 10)">
                    <path d="M45 130 Q55 95 65 130 Q75 105 80 130 Z" fill="#ef4444">
                        <animate attributeName="transform" type="scale" values="1;1.1;1" dur="0.8s" repeatCount="indefinite"/>
                    </path>
                    <path d="M85 110 Q140 75 195 85" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6,4"/>
                    <path d="M195 100 Q140 125 85 120" fill="none" stroke="#fbbf24" stroke-width="3"/>
                    <ellipse cx="215" cy="92" rx="32" ry="26" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
                    <path d="M202 80 Q215 92 202 104 M228 80 Q215 92 228 104 M205 92 L225 92" stroke="#ec4899" stroke-width="4" fill="none" stroke-linecap="round"/>
                </g>
            </svg>`;

        case 13: // Ilustración gráfica pura: Silueta alar sin textos
            return `
            <svg viewBox="0 0 280 180">
                <g transform="translate(0, 10)">
                    <animateTransform attributeName="transform" type="translate" values="0,14; 0,4; 0,14" dur="1.5s" repeatCount="indefinite"/>
                    <path d="M40 95 Q90 35 235 45 C210 75, 195 95, 210 120 C175 105, 150 115, 155 135 C120 115, 85 120, 40 95 Z" fill="rgba(168, 85, 247, 0.45)" stroke="#d8b4fe" stroke-width="2"/>
                    <polyline points="40,95 95,62 145,52 235,45" fill="none" stroke="#fef08a" stroke-width="3.5" stroke-linecap="round"/>
                    <line x1="145" y1="52" x2="210" y2="120" stroke="#fef08a" stroke-width="2.5"/>
                    <line x1="145" y1="52" x2="155" y2="135" stroke="#fef08a" stroke-width="2.5"/>
                    <line x1="145" y1="52" x2="115" y2="122" stroke="#fef08a" stroke-width="2"/>
                </g>
            </svg>`;

        case 14: // Ilustración gráfica pura: Pez en el agua sin texto explicativo
            return `
            <svg viewBox="0 0 280 180">
                <path d="M45 95 C65 45, 155 45, 195 65 L195 125 C155 145, 65 145, 45 95 Z" fill="#0369a1" stroke="#38bdf8" stroke-width="2.5"/>
                <circle cx="80" cy="83" r="6" fill="#fff"/>
                <circle cx="80" cy="83" r="3" fill="#000"/>
                <path d="M135 67 Q150 95 135 123" fill="none" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
                <path d="M148 69 Q163 95 148 121" fill="none" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
                <path d="M161 71 Q176 95 161 119" fill="none" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
                <path d="M20 95 L185 95" stroke="#7dd3fc" stroke-width="2.5" stroke-dasharray="5,4"/>
            </svg>`;

        case 15: // Ilustración gráfica pura: Bosque vivo vs Bosque talado sin textos explicativos
        default:
            return `
            <svg viewBox="0 0 280 180">
                <line x1="140" y1="25" x2="140" y2="155" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,4"/>
                <!-- Mitad izquierda: Árboles -->
                <rect x="55" y="100" width="14" height="45" fill="#78350f"/>
                <circle cx="62" cy="78" r="28" fill="#16a34a" stroke="#4ade80" stroke-width="1.5"/>
                <rect x="95" y="110" width="10" height="35" fill="#78350f"/>
                <circle cx="100" cy="95" r="20" fill="#15803d"/>
                <!-- Mitad derecha: Tocones talados -->
                <rect x="175" y="125" width="18" height="20" fill="#78350f"/>
                <ellipse cx="184" cy="125" rx="9" ry="3.5" fill="#d97706"/>
                <rect x="218" y="128" width="16" height="17" fill="#78350f"/>
                <ellipse cx="226" cy="128" rx="8" ry="3" fill="#d97706"/>
            </svg>`;
    }
}

// ============================================================================
// 4. GENERADOR DE SKINS ÚNICAS POR NIVEL Y JEFE FINAL GOLEM GIGANTE (15 SKINS SVG)
// ============================================================================
function getEnemySVG(enemyType, levelNum = 1) {
    if (enemyType === "bossGolem" || levelNum === 15) {
        // NIVEL 15: SKIN DE GOLEM GIGANTE PARA EL JEFE FINAL
        return `
        <svg viewBox="0 0 260 260" class="boss-golem-svg">
            <defs>
                <linearGradient id="obsidianRock" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#475569"/>
                    <stop offset="50%" stop-color="#1e293b"/>
                    <stop offset="100%" stop-color="#090d16"/>
                </linearGradient>
                <linearGradient id="magmaCore" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fef08a"/>
                    <stop offset="50%" stop-color="#f97316"/>
                    <stop offset="100%" stop-color="#dc2626"/>
                </linearGradient>
            </defs>
            <!-- Sombra Colosal -->
            <ellipse cx="130" cy="242" rx="85" ry="14" fill="rgba(0,0,0,0.75)"/>
            
            <!-- Piernas Monolíticas -->
            <polygon points="75,165 115,165 120,235 65,235" fill="url(#obsidianRock)" stroke="#64748b" stroke-width="2.5"/>
            <polygon points="145,165 185,165 195,235 140,235" fill="url(#obsidianRock)" stroke="#64748b" stroke-width="2.5"/>

            <!-- Torso de Roca Ancestral con Grietas de Magma/Bio-Energía -->
            <polygon points="55,65 205,65 185,172 75,172" fill="url(#obsidianRock)" stroke="#94a3b8" stroke-width="3"/>
            
            <!-- Raíces y Cristales en los Hombros del Golem -->
            <polygon points="30,50 75,40 85,85 25,85" fill="#1e293b" stroke="#fbbf24" stroke-width="2.5"/>
            <polygon points="230,50 185,40 175,85 235,85" fill="#1e293b" stroke="#fbbf24" stroke-width="2.5"/>
            <polygon points="45,25 60,50 35,50" fill="#10b981"/>
            <polygon points="215,25 225,50 200,50" fill="#10b981"/>

            <!-- Núcleo del Guardián de la Vida en el Pecho -->
            <circle cx="130" cy="115" r="26" fill="url(#magmaCore)" stroke="#fef08a" stroke-width="3">
                <animate attributeName="r" values="24;28;24" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <!-- Runas de energía conectadas al núcleo -->
            <path d="M130 89 L130 68 M104 115 L75 105 M156 115 L185 105 M115 138 L95 162 M145 138 L165 162" stroke="#f97316" stroke-width="3.5" stroke-linecap="round"/>

            <!-- Brazos Gigantes de Piedra -->
            <g>
                <animateTransform attributeName="transform" type="translate" values="0,0; 0,6; 0,0" dur="2s" repeatCount="indefinite"/>
                <polygon points="18,80 62,80 55,180 12,170" fill="url(#obsidianRock)" stroke="#64748b" stroke-width="2.5"/>
                <polygon points="198,80 242,80 248,170 205,180" fill="url(#obsidianRock)" stroke="#64748b" stroke-width="2.5"/>
                <!-- Puños de Magma -->
                <circle cx="34" cy="182" r="22" fill="#334155" stroke="#f97316" stroke-width="3"/>
                <circle cx="226" cy="182" r="22" fill="#334155" stroke="#f97316" stroke-width="3"/>
            </g>

            <!-- Cabeza Monolítica del Golem -->
            <polygon points="92,22 168,22 178,72 82,72" fill="url(#obsidianRock)" stroke="#fbbf24" stroke-width="2.5"/>
            <!-- Corona de Runas Antiguas -->
            <polygon points="105,22 118,6 130,20 142,6 155,22" fill="#fbbf24"/>
            <!-- Ojos Ardientes del Golem -->
            <polygon points="100,45 122,50 105,58" fill="#fef08a"/>
            <polygon points="160,45 138,50 155,58" fill="#fef08a"/>
        </svg>`;
    }

    switch (levelNum) {
        case 1: // Nivel 1: Mutante Bacilo Flagelado (Pantano de Microorganismos)
            return `
            <svg viewBox="0 0 220 220">
                <ellipse cx="110" cy="198" rx="58" ry="10" fill="rgba(0,0,0,0.6)"/>
                <!-- Pili / Cilios alrededor de la cápsula -->
                <g stroke="#6ee7b7" stroke-width="3" stroke-linecap="round">
                    <line x1="65" y1="60" x2="50" y2="42"/><line x1="95" y1="45" x2="90" y2="25"/>
                    <line x1="125" y1="45" x2="132" y2="25"/><line x1="155" y1="60" x2="170" y2="42"/>
                    <line x1="55" y1="95" x2="35" y2="90"/><line x1="165" y1="95" x2="185" y2="90"/>
                </g>
                <!-- Flagelos látigo animados -->
                <path d="M145 165 Q185 185 205 150 T215 110" fill="none" stroke="#10b981" stroke-width="5" stroke-linecap="round">
                    <animate attributeName="d" values="M145 165 Q185 185 205 150 T215 110; M145 165 Q190 140 205 170 T215 135; M145 165 Q185 185 205 150 T215 110" dur="1.1s" repeatCount="indefinite"/>
                </path>
                <!-- Cápsula Procariota Acorazada -->
                <rect x="58" y="48" width="104" height="136" rx="52" fill="#059669" stroke="#a7f3d0" stroke-width="4"/>
                <rect x="68" y="58" width="84" height="116" rx="42" fill="#047857" stroke="#34d399" stroke-width="2" stroke-dasharray="6,4"/>
                <!-- Tres Ojos Microbianos -->
                <circle cx="90" cy="95" r="10" fill="#090d16"/><circle cx="90" cy="95" r="5" fill="#fef08a"/>
                <circle cx="130" cy="95" r="10" fill="#090d16"/><circle cx="130" cy="95" r="5" fill="#fef08a"/>
                <circle cx="110" cy="74" r="7" fill="#090d16"/><circle cx="110" cy="74" r="3.5" fill="#ef4444"/>
                <!-- Fauces Bacterianas -->
                <path d="M82 132 Q110 152 138 132" fill="#064e3b" stroke="#a7f3d0" stroke-width="3"/>
                <polygon points="90,135 95,146 100,135" fill="#fff"/>
                <polygon points="120,135 125,146 130,135" fill="#fff"/>
            </svg>`;

        case 2: // Nivel 2: Gólem Alquimista de Matraz Láctico (Laboratorio Secreto)
            return `
            <svg viewBox="0 0 220 220">
                <ellipse cx="110" cy="198" rx="55" ry="10" fill="rgba(0,0,0,0.6)"/>
                <!-- Cuerpo de Matraz Erlenmeyer Viviente -->
                <polygon points="88,36 132,36 132,72 178,172 42,172 88,72" fill="rgba(224, 242, 254, 0.28)" stroke="#bae6fd" stroke-width="4" stroke-linejoin="round"/>
                <rect x="82" y="26" width="56" height="12" rx="5" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>
                <!-- Líquido de Fermentación Láctica Burbujeante -->
                <path d="M62 128 Q110 118 158 128 L172 168 L48 168 Z" fill="#ec4899" opacity="0.88"/>
                <circle cx="85" cy="150" r="6" fill="#fbcfe8"><animate attributeName="cy" values="158;122;158" dur="1.6s" repeatCount="indefinite"/></circle>
                <circle cx="135" cy="145" r="5" fill="#fbcfe8"><animate attributeName="cy" values="160;120;160" dur="1.3s" repeatCount="indefinite"/></circle>
                <!-- Brazos de Vapor Láctico -->
                <path d="M68 110 C32 95, 22 130, 42 150" fill="none" stroke="#f472b6" stroke-width="8" stroke-linecap="round"/>
                <path d="M152 110 C188 95, 198 130, 178 150" fill="none" stroke="#f472b6" stroke-width="8" stroke-linecap="round"/>
                <!-- Ojos Alquímicos Brillantes -->
                <ellipse cx="92" cy="105" rx="9" ry="11" fill="#090d16"/><circle cx="92" cy="105" r="5" fill="#fde047"/>
                <ellipse cx="128" cy="105" rx="9" ry="11" fill="#090d16"/><circle cx="128" cy="105" r="5" fill="#fde047"/>
            </svg>`;

        case 3: // Nivel 3: Titán Anémona de Arrecife con Tentáculos Urticantes
            return `
            <svg viewBox="0 0 220 220">
                <ellipse cx="110" cy="198" rx="64" ry="11" fill="rgba(0,0,0,0.6)"/>
                <!-- Corona de Tentáculos Urticantes Animados -->
                <g stroke="#f43f5e" stroke-width="10" stroke-linecap="round" fill="none">
                    <path d="M65 130 Q35 75 55 35"><animate attributeName="d" values="M65 130 Q35 75 55 35; M65 130 Q55 75 35 45; M65 130 Q35 75 55 35" dur="1.8s" repeatCount="indefinite"/></path>
                    <path d="M88 125 Q75 62 85 25"><animate attributeName="d" values="M88 125 Q75 62 85 25; M88 125 Q95 62 72 28; M88 125 Q75 62 85 25" dur="2.1s" repeatCount="indefinite"/></path>
                    <path d="M112 125 Q115 58 110 20"><animate attributeName="d" values="M112 125 Q115 58 110 20; M112 125 Q100 58 122 22; M112 125 Q115 58 110 20" dur="1.9s" repeatCount="indefinite"/></path>
                    <path d="M135 125 Q150 62 138 25"><animate attributeName="d" values="M135 125 Q150 62 138 25; M135 125 Q125 62 152 30; M135 125 Q150 62 138 25" dur="2.2s" repeatCount="indefinite"/></path>
                    <path d="M155 130 Q185 75 165 35"><animate attributeName="d" values="M155 130 Q185 75 165 35; M155 130 Q165 75 185 45; M155 130 Q185 75 165 35" dur="1.7s" repeatCount="indefinite"/></path>
                </g>
                <!-- Puntas Bioluminiscentes -->
                <circle cx="55" cy="35" r="6" fill="#38bdf8"/><circle cx="85" cy="25" r="6" fill="#38bdf8"/>
                <circle cx="110" cy="20" r="6" fill="#38bdf8"/><circle cx="138" cy="25" r="6" fill="#38bdf8"/><circle cx="165" cy="35" r="6" fill="#38bdf8"/>
                <!-- Bulbo Basal de la Anémona -->
                <path d="M52 125 C42 165, 55 188, 110 188 C165 188, 178 165, 168 125 Z" fill="#be123c" stroke="#fda4af" stroke-width="3.5"/>
                <!-- Ojos Abisales -->
                <circle cx="86" cy="150" r="9" fill="#090d16"/><circle cx="86" cy="150" r="4.5" fill="#38bdf8"/>
                <circle cx="134" cy="150" r="9" fill="#090d16"/><circle cx="134" cy="150" r="4.5" fill="#38bdf8"/>
                <path d="M92 172 Q110 162 128 172" fill="none" stroke="#fef08a" stroke-width="3.5" stroke-linecap="round"/>
            </svg>`;

        case 4: // Nivel 4: Treant Fúngico de Liquen y Roca (Árbol Enfermo)
            return `
            <svg viewBox="0 0 220 220">
                <ellipse cx="110" cy="198" rx="62" ry="11" fill="rgba(0,0,0,0.6)"/>
                <!-- Tronco de Corteza y Roca -->
                <polygon points="65,75 155,75 168,188 52,188" fill="#57534e" stroke="#a8a29e" stroke-width="3"/>
                <path d="M82 75 L75 188 M135 75 L142 188" stroke="#292524" stroke-width="3"/>
                <!-- Sombrero de Hongo Simbiótico Superior -->
                <path d="M35 82 C35 28, 185 28, 185 82 Z" fill="#a16207" stroke="#fde047" stroke-width="3"/>
                <!-- Placas de Algas/Cianobacterias Verdes Brillantes -->
                <circle cx="75" cy="58" r="12" fill="#22c55e"/><circle cx="115" cy="48" r="15" fill="#4ade80"/><circle cx="150" cy="62" r="11" fill="#22c55e"/>
                <!-- Brazos de Ramas Retorcidas -->
                <path d="M62 115 L22 92 L32 72" fill="none" stroke="#78350f" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M158 115 L198 92 L188 72" fill="none" stroke="#78350f" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
                <!-- Rostro Tallado en la Corteza -->
                <polygon points="80,108 100,114 85,122" fill="#bef264"/>
                <polygon points="140,108 120,114 135,122" fill="#bef264"/>
                <polygon points="88,152 110,142 132,152 122,165 98,165" fill="#1c1917" stroke="#84cc16" stroke-width="2"/>
            </svg>`;

        case 5: // Nivel 5: Hidra de Lodo Químico Tóxico (Río Contaminado)
            return `
            <svg viewBox="0 0 220 220">
                <ellipse cx="110" cy="198" rx="68" ry="12" fill="rgba(0,0,0,0.65)"/>
                <!-- Base de Lodo Contaminante -->
                <path d="M38 175 Q65 140 110 150 Q155 140 182 175 Q195 192 110 192 Q25 192 38 175 Z" fill="#581c87" stroke="#c084fc" stroke-width="3"/>
                <!-- Cuello Izquierdo de la Hidra -->
                <path d="M78 160 Q42 110 58 65" fill="none" stroke="#7e22ce" stroke-width="18" stroke-linecap="round"/>
                <circle cx="58" cy="62" r="20" fill="#6b21a8" stroke="#d8b4fe" stroke-width="2.5"/>
                <circle cx="52" cy="58" r="5" fill="#a3e635"/><circle cx="66" cy="58" r="5" fill="#a3e635"/>
                <!-- Cuello Central Alfa -->
                <path d="M110 155 Q110 95 110 48" fill="none" stroke="#9333ea" stroke-width="22" stroke-linecap="round"/>
                <circle cx="110" cy="45" r="24" fill="#581c87" stroke="#a3e635" stroke-width="3"/>
                <circle cx="101" cy="42" r="6" fill="#fef08a"/><circle cx="119" cy="42" r="6" fill="#fef08a"/>
                <!-- Cuello Derecho de la Hidra -->
                <path d="M142 160 Q178 110 162 65" fill="none" stroke="#7e22ce" stroke-width="18" stroke-linecap="round"/>
                <circle cx="162" cy="62" r="20" fill="#6b21a8" stroke="#d8b4fe" stroke-width="2.5"/>
                <circle cx="154" cy="58" r="5" fill="#a3e635"/><circle cx="168" cy="58" r="5" fill="#a3e635"/>
                <!-- Gotas de Ácido Verde -->
                <circle cx="58" cy="95" r="5" fill="#84cc16"><animate attributeName="cy" values="82;145;82" dur="1.4s" repeatCount="indefinite"/></circle>
                <circle cx="162" cy="95" r="5" fill="#84cc16"><animate attributeName="cy" values="82;145;82" dur="1.7s" repeatCount="indefinite"/></circle>
            </svg>`;

        case 6: // Nivel 6: Cobra Real Depredadora Trófica (Cadena Alimentaria)
            return `
            <svg viewBox="0 0 220 220">
                <ellipse cx="110" cy="198" rx="62" ry="11" fill="rgba(0,0,0,0.6)"/>
                <!-- Capucha Imperial de la Cobra -->
                <path d="M110 28 C42 35, 32 115, 78 145 L142 145 C188 115, 178 35, 110 28 Z" fill="#b45309" stroke="#fde047" stroke-width="3.5"/>
                <!-- Marcas Ocelares en la Capucha -->
                <circle cx="72" cy="82" r="12" fill="none" stroke="#fef08a" stroke-width="3"/>
                <circle cx="148" cy="82" r="12" fill="none" stroke="#fef08a" stroke-width="3"/>
                <!-- Anillos Enroscados del Cuerpo -->
                <ellipse cx="110" cy="176" rx="58" ry="16" fill="#92400e" stroke="#fbbf24" stroke-width="2.5"/>
                <ellipse cx="110" cy="158" rx="44" ry="14" fill="#d97706" stroke="#fde047" stroke-width="2.5"/>
                <!-- Cabeza de Víbora y Colmillos -->
                <path d="M84 62 L136 62 L126 112 L94 112 Z" fill="#78350f" stroke="#fef08a" stroke-width="2"/>
                <polygon points="92,76 106,82 94,88" fill="#ef4444"/>
                <polygon points="128,76 114,82 126,88" fill="#ef4444"/>
                <!-- Colmillos y Lengua Bífida -->
                <polygon points="98,112 102,126 106,112" fill="#ffffff"/>
                <polygon points="114,112 118,126 122,112" fill="#ffffff"/>
                <path d="M110 112 L110 138 L102 148 M110 138 L118 148" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
            </svg>`;

        case 7: // Nivel 7: Arconte Helicoidal del Cromosoma (El Código Oculto)
            return `
            <svg viewBox="0 0 220 220">
                <ellipse cx="110" cy="198" rx="52" ry="10" fill="rgba(0,0,0,0.6)"/>
                <!-- Cuerpo en Forma de Cromosoma / Doble Hélice Viviente -->
                <g>
                    <animateTransform attributeName="transform" type="rotate" values="-4 110 110; 4 110 110; -4 110 110" dur="2.2s" repeatCount="indefinite"/>
                    <path d="M68 35 L152 175" stroke="#ec4899" stroke-width="26" stroke-linecap="round"/>
                    <path d="M152 35 L68 175" stroke="#38bdf8" stroke-width="26" stroke-linecap="round"/>
                    <!-- Bandas Génicas en los Brazos Cromosómicos -->
                    <line x1="68" y1="55" x2="90" y2="42" stroke="#fde047" stroke-width="4"/>
                    <line x1="130" y1="42" x2="152" y2="55" stroke="#fde047" stroke-width="4"/>
                    <line x1="68" y1="155" x2="90" y2="168" stroke="#34d399" stroke-width="4"/>
                    <line x1="130" y1="168" x2="152" y2="155" stroke="#34d399" stroke-width="4"/>
                    <!-- Centrómero Núcleo Consciente -->
                    <circle cx="110" cy="105" r="28" fill="#1e1b4b" stroke="#fbbf24" stroke-width="4"/>
                    <circle cx="110" cy="105" r="14" fill="#38bdf8"/>
                    <circle cx="110" cy="105" r="6" fill="#ffffff"/>
                </g>
            </svg>`;

        case 8: // Nivel 8: Dragón Quimérico de Escamas Doradas y Plateadas (Dd)
            return `
            <svg viewBox="0 0 220 220">
                <ellipse cx="110" cy="198" rx="65" ry="11" fill="rgba(0,0,0,0.65)"/>
                <!-- Ala Izquierda Dorada (Alelo Dominante D) -->
                <path d="M95 105 L15 42 L28 115 L55 108 L45 142 L95 130 Z" fill="#eab308" stroke="#fef08a" stroke-width="2.5"/>
                <!-- Ala Derecha Plateada (Alelo Recesivo d) -->
                <path d="M125 105 L205 42 L192 115 L165 108 L175 142 L125 130 Z" fill="#94a3b8" stroke="#f8fafc" stroke-width="2.5"/>
                <!-- Torso Dracónico Bicolor -->
                <path d="M75 88 L110 88 L110 182 L68 182 Z" fill="#ca8a04" stroke="#fef08a" stroke-width="2"/>
                <path d="M110 88 L145 88 L152 182 L110 182 Z" fill="#64748b" stroke="#e2e8f0" stroke-width="2"/>
                <!-- Cabeza de Dragón con Cuernos -->
                <polygon points="80,48 62,18 96,42" fill="#fef08a"/>
                <polygon points="140,48 158,18 124,42" fill="#e2e8f0"/>
                <polygon points="78,45 142,45 132,95 88,95" fill="#b45309" stroke="#fde047" stroke-width="2.5"/>
                <!-- Ojos de Dragón -->
                <polygon points="88,62 104,68 90,74" fill="#ef4444"/>
                <polygon points="132,62 116,68 130,74" fill="#38bdf8"/>
                <!-- Aliento de Fuego Genético -->
                <path d="M98 95 Q110 118 122 95" fill="#f97316"/>
            </svg>`;

        case 9: // Nivel 9: Djinn Elemental de Vapor y Sequía (La Fuente Desaparecida)
            return `
            <svg viewBox="0 0 220 220">
                <ellipse cx="110" cy="198" rx="48" ry="9" fill="rgba(0,0,0,0.5)"/>
                <!-- Torbellino Inferior de Vapor y Arena -->
                <path d="M110 192 C75 168, 145 145, 85 122 C65 108, 155 108, 135 122 C165 145, 95 168, 110 192 Z" fill="#bae6fd" opacity="0.75">
                    <animateTransform attributeName="transform" type="translate" values="-4,0; 4,0; -4,0" dur="1.4s" repeatCount="indefinite"/>
                </path>
                <!-- Torso Etéreo de Nube Térmica -->
                <path d="M58 95 C45 55, 85 35, 110 45 C135 35, 175 55, 162 95 C175 118, 145 135, 110 130 C75 135, 45 118, 58 95 Z" fill="#38bdf8" stroke="#e0f2fe" stroke-width="3"/>
                <!-- Corona Solar de Evaporación -->
                <polygon points="85,42 98,20 110,38 122,20 135,42" fill="#facc15" stroke="#fef08a" stroke-width="1.5"/>
                <!-- Ojos Incandescentes -->
                <circle cx="90" cy="82" r="8" fill="#fef08a"/>
                <circle cx="130" cy="82" r="8" fill="#fef08a"/>
                <path d="M92 106 Q110 96 128 106" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
            </svg>`;

        case 10: // Nivel 10: Coloso Cristalino de Diamante y Carbono-12 (El Enigma del Carbono)
            return `
            <svg viewBox="0 0 220 220">
                <ellipse cx="110" cy="198" rx="62" ry="11" fill="rgba(0,0,0,0.65)"/>
                <!-- Estructura Cristalina Hexagonal de Grafito/Diamante -->
                <polygon points="110,24 168,62 152,175 68,175 52,62" fill="#1e293b" stroke="#34d399" stroke-width="3.5"/>
                <!-- Facetas Internas de Cristal de Carbono -->
                <polygon points="110,24 142,78 110,135 78,78" fill="#065f46" stroke="#6ee7b7" stroke-width="2"/>
                <line x1="52" y1="62" x2="168" y2="62" stroke="#34d399" stroke-width="2"/>
                <line x1="78" y1="78" x2="68" y2="175" stroke="#34d399" stroke-width="2"/>
                <line x1="142" y1="78" x2="152" y2="175" stroke="#34d399" stroke-width="2"/>
                <!-- Cristales Flotantes de CO2 -->
                <polygon points="32,85 45,70 48,95" fill="#10b981"><animateTransform attributeName="transform" type="translate" values="0,-6; 0,6; 0,-6" dur="1.6s" repeatCount="indefinite"/></polygon>
                <polygon points="188,85 175,70 172,95" fill="#10b981"><animateTransform attributeName="transform" type="translate" values="0,6; 0,-6; 0,6" dur="1.6s" repeatCount="indefinite"/></polygon>
                <!-- Visor del Coloso -->
                <polygon points="84,82 105,90 88,98" fill="#fef08a"/>
                <polygon points="136,82 115,90 132,98" fill="#fef08a"/>
            </svg>`;

        case 11: // Nivel 11: Autómata Sináptico del Cerebelo (La Trampa Eléctrica)
            return `
            <svg viewBox="0 0 220 220">
                <ellipse cx="110" cy="198" rx="54" ry="10" fill="rgba(0,0,0,0.6)"/>
                <!-- Dendritas / Tentáculos Axónicos Flotantes -->
                <g stroke="#38bdf8" stroke-width="4" fill="none" stroke-linecap="round">
                    <path d="M78 135 L58 182 L42 188"/><path d="M98 140 L92 188"/>
                    <path d="M122 140 L128 188"/><path d="M142 135 L162 182 L178 188"/>
                </g>
                <!-- Cúpula Cibernética con Lóbulos Cerebelosos -->
                <path d="M52 115 C42 42, 178 42, 168 115 Z" fill="rgba(30, 41, 59, 0.85)" stroke="#60a5fa" stroke-width="3.5"/>
                <!-- Hemisferios Plegados Rosa Neón -->
                <path d="M65 98 C62 62, 108 58, 108 98 C108 58, 158 62, 155 98 Z" fill="#ec4899" stroke="#fbcfe8" stroke-width="2.5"/>
                <!-- Nodos Sinápticos Eléctricos -->
                <circle cx="85" cy="78" r="4" fill="#fef08a"><animate attributeName="opacity" values="0.2;1;0.2" dur="0.7s" repeatCount="indefinite"/></circle>
                <circle cx="135" cy="78" r="4" fill="#fef08a"><animate attributeName="opacity" values="1;0.2;1" dur="0.7s" repeatCount="indefinite"/></circle>
                <!-- Ojo Cibernético Central -->
                <rect x="65" y="108" width="90" height="24" rx="12" fill="#090d16" stroke="#38bdf8" stroke-width="2.5"/>
                <circle cx="110" cy="120" r="9" fill="#ef4444">
                    <animate attributeName="cx" values="88;132;88" dur="2.2s" repeatCount="indefinite"/>
                </circle>
            </svg>`;

        case 12: // Nivel 12: Centinela del Arco Reflejo Medular (El Puente Peligroso)
            return `
            <svg viewBox="0 0 220 220">
                <ellipse cx="110" cy="198" rx="56" ry="10" fill="rgba(0,0,0,0.6)"/>
                <!-- Columna Vertebral Articulada -->
                <g fill="#cbd5e1" stroke="#475569" stroke-width="2.5">
                    <rect x="85" y="152" width="50" height="16" rx="5"/>
                    <rect x="82" y="130" width="56" height="16" rx="5"/>
                    <rect x="78" y="108" width="64" height="16" rx="5"/>
                    <rect x="82" y="86" width="56" height="16" rx="5"/>
                </g>
                <!-- Nervios Espinales de Fuego y Electricidad -->
                <path d="M78 115 Q35 95 28 135" fill="none" stroke="#f97316" stroke-width="6" stroke-linecap="round"/>
                <path d="M142 115 Q185 95 192 135" fill="none" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
                <!-- Cráneo / Escudo Medular en Forma de Mariposa Gris -->
                <path d="M65 45 C42 32, 42 88, 85 82 L110 75 L135 82 C178 88, 178 32, 155 45 L110 55 Z" fill="#dc2626" stroke="#fef08a" stroke-width="3"/>
                <circle cx="88" cy="64" r="7" fill="#fef08a"/>
                <circle cx="132" cy="64" r="7" fill="#fef08a"/>
            </svg>`;

        case 13: // Nivel 13: Señor Vampiro Quiróptero Alfa (El Vuelo del Murciélago)
            return `
            <svg viewBox="0 0 220 220">
                <ellipse cx="110" cy="198" rx="52" ry="9" fill="rgba(0,0,0,0.55)"/>
                <!-- Alas Quirópteras Gigantes con Falanges Visibles -->
                <g>
                    <animateTransform attributeName="transform" type="translate" values="0,-6; 0,6; 0,-6" dur="1.1s" repeatCount="indefinite"/>
                    <!-- Ala Izquierda -->
                    <path d="M88 98 L12 45 C18 82, 28 112, 18 138 C42 122, 62 132, 68 148 L88 122 Z" fill="#4c1d95" stroke="#c084fc" stroke-width="2.5"/>
                    <line x1="88" y1="98" x2="18" y2="138" stroke="#e9d5ff" stroke-width="2"/>
                    <line x1="88" y1="98" x2="68" y2="148" stroke="#e9d5ff" stroke-width="2"/>
                    <!-- Ala Derecha -->
                    <path d="M132 98 L208 45 C202 82, 192 112, 202 138 C178 122, 158 132, 152 148 L132 122 Z" fill="#4c1d95" stroke="#c084fc" stroke-width="2.5"/>
                    <line x1="132" y1="98" x2="202" y2="138" stroke="#e9d5ff" stroke-width="2"/>
                    <line x1="132" y1="98" x2="152" y2="148" stroke="#e9d5ff" stroke-width="2"/>
                    <!-- Cuerpo y Orejas de Ecolocalización -->
                    <ellipse cx="110" cy="115" rx="28" ry="38" fill="#1e1b4b" stroke="#a855f7" stroke-width="2.5"/>
                    <polygon points="85,82 72,32 102,72" fill="#3b0764" stroke="#d8b4fe" stroke-width="2"/>
                    <polygon points="135,82 148,32 118,72" fill="#3b0764" stroke="#d8b4fe" stroke-width="2"/>
                    <!-- Ojos Rojos y Colmillos -->
                    <circle cx="98" cy="95" r="6" fill="#ef4444"/><circle cx="122" cy="95" r="6" fill="#ef4444"/>
                    <polygon points="102,115 105,126 108,115" fill="#fff"/>
                    <polygon points="112,115 115,126 118,115" fill="#fff"/>
                </g>
            </svg>`;

        case 14: // Nivel 14: Leviatán Abisal Branquial con Antena Bioluminiscente (El Pez de las Profundidades)
        default:
            return `
            <svg viewBox="0 0 220 220">
                <ellipse cx="110" cy="198" rx="64" ry="11" fill="rgba(0,0,0,0.65)"/>
                <!-- Aleta Dorsal y Caudal Abisal -->
                <polygon points="95,55 135,25 148,68" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
                <polygon points="168,125 208,88 198,162" fill="#0369a1" stroke="#38bdf8" stroke-width="2.5"/>
                <!-- Antena Bioluminiscente (Illicium) -->
                <path d="M88 65 Q45 25 38 58" fill="none" stroke="#7dd3fc" stroke-width="4"/>
                <circle cx="38" cy="62" r="11" fill="#fef08a">
                    <animate attributeName="r" values="9;14;9" dur="1.2s" repeatCount="indefinite"/>
                </circle>
                <!-- Cuerpo Acorazado del Pez Abisal -->
                <ellipse cx="112" cy="122" rx="64" ry="48" fill="#0f172a" stroke="#0284c7" stroke-width="4"/>
                <!-- 3 Hendiduras Branquiales Rojas Pulsantes -->
                <path d="M128 96 Q140 122 128 148" fill="none" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
                <path d="M140 98 Q152 122 140 146" fill="none" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
                <path d="M152 102 Q164 122 152 142" fill="none" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
                <!-- Ojo Abisal y Mandíbula con Colmillos -->
                <circle cx="78" cy="104" r="10" fill="#38bdf8"/><circle cx="76" cy="104" r="4" fill="#090d16"/>
                <path d="M52 132 L105 138 L95 158 L56 152 Z" fill="#090d16" stroke="#38bdf8" stroke-width="2"/>
                <polygon points="58,132 62,145 66,132" fill="#e2e8f0"/>
                <polygon points="74,134 78,147 82,134" fill="#e2e8f0"/>
                <polygon points="90,136 94,148 98,136" fill="#e2e8f0"/>
            </svg>`;
    }
}

// ============================================================================
// 5. MOTOR DE BASE DE DATOS SQL (SQLite WebAssembly + Sincronización en Tiempo Real)
// ============================================================================
const DB_STORAGE_KEY = "dinamica_quimica_sqlite_db_v1";
const DB_FALLBACK_KEY = "dinamica_quimica_records_fallback_v1";
const ADMIN_SECRET_PASS = "holamama";

class SQLDatabaseManager {
    constructor() {
        this.db = null;
        this.useSqlJs = false;
        this.fallbackRows = [];
        this.channel = typeof BroadcastChannel !== "undefined"
            ? new BroadcastChannel("dinamica_quimica_realtime_sql")
            : null;
    }

    async init() {
        try {
            if (typeof window.initSqlJs === "function") {
                const SQL = await window.initSqlJs({
                    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
                });
                const savedBase64 = localStorage.getItem(DB_STORAGE_KEY);
                if (savedBase64) {
                    const binary = Uint8Array.from(atob(savedBase64), c => c.charCodeAt(0));
                    this.db = new SQL.Database(binary);
                } else {
                    this.db = new SQL.Database();
                }
                this.useSqlJs = true;
                this.createSchema();
                this.saveToStorage();
                return;
            }
        } catch (err) {
            console.warn("Usando motor SQL emulado local (sin conexión CDN):", err);
        }

        // Respaldo relacional si no hay internet para descargar el wasm
        this.useSqlJs = false;
        this.loadFallback();
    }

    createSchema() {
        if (!this.useSqlJs) return;
        this.db.run(`
            CREATE TABLE IF NOT EXISTS jugadores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL UNIQUE,
                nivel_actual INTEGER NOT NULL DEFAULT 1,
                puntos INTEGER NOT NULL DEFAULT 0,
                puntos_nivel_disp INTEGER NOT NULL DEFAULT 500,
                bonus_rapidos INTEGER NOT NULL DEFAULT 0,
                pv INTEGER NOT NULL DEFAULT 5,
                pv_max INTEGER NOT NULL DEFAULT 5,
                pociones INTEGER NOT NULL DEFAULT 1,
                aciertos INTEGER NOT NULL DEFAULT 0,
                errores INTEGER NOT NULL DEFAULT 0,
                escudo INTEGER NOT NULL DEFAULT 0,
                piedra INTEGER NOT NULL DEFAULT 0,
                alas INTEGER NOT NULL DEFAULT 0,
                llave INTEGER NOT NULL DEFAULT 0,
                estado TEXT NOT NULL DEFAULT 'En progreso',
                fecha_registro TEXT NOT NULL,
                ultima_actualizacion TEXT NOT NULL
            );
        `);
        // Migración automática si la tabla ya existía antes en localStorage
        try { this.db.run("ALTER TABLE jugadores ADD COLUMN puntos INTEGER NOT NULL DEFAULT 0;"); } catch (e) {}
        try { this.db.run("ALTER TABLE jugadores ADD COLUMN puntos_nivel_disp INTEGER NOT NULL DEFAULT 500;"); } catch (e) {}
        try { this.db.run("ALTER TABLE jugadores ADD COLUMN bonus_rapidos INTEGER NOT NULL DEFAULT 0;"); } catch (e) {}
    }

    saveToStorage() {
        if (this.useSqlJs && this.db) {
            const data = this.db.export();
            let binaryStr = "";
            for (let i = 0; i < data.length; i++) {
                binaryStr += String.fromCharCode(data[i]);
            }
            localStorage.setItem(DB_STORAGE_KEY, btoa(binaryStr));
        } else {
            localStorage.setItem(DB_FALLBACK_KEY, JSON.stringify(this.fallbackRows));
        }

        if (this.channel) {
            this.channel.postMessage({ type: "SQL_UPDATED", timestamp: Date.now() });
        }
    }

    reloadFromStorage() {
        if (this.useSqlJs && this.db) {
            const savedBase64 = localStorage.getItem(DB_STORAGE_KEY);
            if (savedBase64) {
                const binary = Uint8Array.from(atob(savedBase64), c => c.charCodeAt(0));
                const SQL = this.db.constructor;
                this.db.close();
                this.db = new SQL(binary);
                try { this.db.run("ALTER TABLE jugadores ADD COLUMN puntos INTEGER NOT NULL DEFAULT 0;"); } catch (e) {}
                try { this.db.run("ALTER TABLE jugadores ADD COLUMN puntos_nivel_disp INTEGER NOT NULL DEFAULT 500;"); } catch (e) {}
                try { this.db.run("ALTER TABLE jugadores ADD COLUMN bonus_rapidos INTEGER NOT NULL DEFAULT 0;"); } catch (e) {}
            }
        } else {
            this.loadFallback();
        }
    }

    loadFallback() {
        try {
            const raw = localStorage.getItem(DB_FALLBACK_KEY);
            this.fallbackRows = raw ? JSON.parse(raw) : [];
        } catch (e) {
            this.fallbackRows = [];
        }
    }

    nowFormatted() {
        const d = new Date();
        return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }

    // Registra un jugador nuevo (ID empieza en 1 y asciende por orden de registro) o recupera si ya existe
    registerOrGetPlayer(rawName) {
        const cleanName = rawName.trim();
        const now = this.nowFormatted();

        if (this.useSqlJs) {
            const existingStmt = this.db.prepare("SELECT * FROM jugadores WHERE LOWER(nombre) = LOWER(:nombre);");
            existingStmt.bind({ ":nombre": cleanName });
            if (existingStmt.step()) {
                const row = existingStmt.getAsObject();
                existingStmt.free();
                return row;
            }
            existingStmt.free();

            // Insertar nuevo jugador (AUTOINCREMENT comienza desde 1 y asciende)
            this.db.run(
                `INSERT INTO jugadores (nombre, nivel_actual, puntos, puntos_nivel_disp, bonus_rapidos, pv, pv_max, pociones, aciertos, errores, escudo, piedra, alas, llave, estado, fecha_registro, ultima_actualizacion)
                 VALUES (?, 1, 0, 500, 0, 5, 5, 1, 0, 0, 0, 0, 0, 0, 'En progreso (Nivel 1)', ?, ?);`,
                [cleanName, now, now]
            );
            this.saveToStorage();

            const newStmt = this.db.prepare("SELECT * FROM jugadores WHERE LOWER(nombre) = LOWER(:nombre);");
            newStmt.bind({ ":nombre": cleanName });
            newStmt.step();
            const created = newStmt.getAsObject();
            newStmt.free();
            return created;
        } else {
            this.loadFallback();
            let found = this.fallbackRows.find(r => r.nombre.toLowerCase() === cleanName.toLowerCase());
            if (found) return found;

            const nextId = this.fallbackRows.length > 0
                ? Math.max(...this.fallbackRows.map(r => r.id)) + 1
                : 1;
            const newPlayer = {
                id: nextId,
                nombre: cleanName,
                nivel_actual: 1,
                puntos: 0,
                puntos_nivel_disp: 500,
                bonus_rapidos: 0,
                pv: 5,
                pv_max: 5,
                pociones: 1,
                aciertos: 0,
                errores: 0,
                escudo: 0,
                piedra: 0,
                alas: 0,
                llave: 0,
                estado: "En progreso (Nivel 1)",
                fecha_registro: now,
                ultima_actualizacion: now
            };
            this.fallbackRows.push(newPlayer);
            this.saveToStorage();
            return newPlayer;
        }
    }

    // Actualiza en tiempo real las estadísticas, tracking de puntos y el nivel del jugador activo en SQL
    updatePlayerProgress(state) {
        if (!state.playerId) return;
        const now = this.nowFormatted();
        const currentLvl = state.currentLevelIndex + 1;

        if (this.useSqlJs) {
            this.db.run(
                `UPDATE jugadores
                 SET nivel_actual = ?,
                     puntos = ?,
                     puntos_nivel_disp = ?,
                     bonus_rapidos = ?,
                     pv = ?,
                     pv_max = ?,
                     pociones = ?,
                     aciertos = ?,
                     errores = ?,
                     escudo = ?,
                     piedra = ?,
                     alas = ?,
                     llave = ?,
                     estado = ?,
                     ultima_actualizacion = ?
                 WHERE id = ?;`,
                [
                    currentLvl,
                    state.score || 0,
                    state.levelAvailablePoints ?? 500,
                    state.fastBonusesWon || 0,
                    state.hp,
                    state.maxHp,
                    state.potions,
                    state.correctCount,
                    state.wrongCount,
                    state.hasShield ? 1 : 0,
                    state.hasStone ? 1 : 0,
                    state.hasWings ? 1 : 0,
                    state.hasKey ? 1 : 0,
                    state.statusText,
                    now,
                    state.playerId
                ]
            );
            this.saveToStorage();
        } else {
            this.loadFallback();
            const idx = this.fallbackRows.findIndex(r => r.id === state.playerId);
            if (idx !== -1) {
                this.fallbackRows[idx] = {
                    ...this.fallbackRows[idx],
                    nivel_actual: currentLvl,
                    puntos: state.score || 0,
                    puntos_nivel_disp: state.levelAvailablePoints ?? 500,
                    bonus_rapidos: state.fastBonusesWon || 0,
                    pv: state.hp,
                    pv_max: state.maxHp,
                    pociones: state.potions,
                    aciertos: state.correctCount,
                    errores: state.wrongCount,
                    escudo: state.hasShield ? 1 : 0,
                    piedra: state.hasStone ? 1 : 0,
                    alas: state.hasWings ? 1 : 0,
                    llave: state.hasKey ? 1 : 0,
                    estado: state.statusText,
                    ultima_actualizacion: now
                };
                this.saveToStorage();
            }
        }
    }

    // Ejecuta una consulta SQL sobre la tabla jugadores
    executeQuery(sqlQuery = "SELECT * FROM jugadores ORDER BY id ASC;") {
        this.reloadFromStorage();
        if (this.useSqlJs) {
            const res = this.db.exec(sqlQuery);
            if (!res || res.length === 0) return [];
            const cols = res[0].columns;
            return res[0].values.map(rowVals => {
                const obj = {};
                cols.forEach((c, i) => (obj[c] = rowVals[i]));
                return obj;
            });
        } else {
            this.loadFallback();
            const rows = [...this.fallbackRows];
            if (sqlQuery.toUpperCase().includes("DESC")) {
                return rows.sort((a, b) => (b.puntos || 0) - (a.puntos || 0) || b.nivel_actual - a.nivel_actual || b.aciertos - a.aciertos);
            }
            return rows.sort((a, b) => a.id - b.id);
        }
    }

    // Genera un volcado .sql completo con CREATE TABLE e INSERTs reales de todos los jugadores registrados
    exportSQLDump() {
        const players = this.executeQuery("SELECT * FROM jugadores ORDER BY id ASC;");
        let dump = `-- ============================================================================\n`;
        dump += `-- VOLCADO SQL EN TIEMPO REAL - DINÁMICA QUÍMICA & BIOLÓGICA\n`;
        dump += `-- Fecha de exportación: ${new Date().toLocaleString("es-MX")}\n`;
        dump += `-- ============================================================================\n\n`;
        dump += `CREATE TABLE IF NOT EXISTS jugadores (\n`;
        dump += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
        dump += `    nombre TEXT NOT NULL UNIQUE,\n`;
        dump += `    nivel_actual INTEGER NOT NULL DEFAULT 1,\n`;
        dump += `    puntos INTEGER NOT NULL DEFAULT 0,\n`;
        dump += `    puntos_nivel_disp INTEGER NOT NULL DEFAULT 500,\n`;
        dump += `    bonus_rapidos INTEGER NOT NULL DEFAULT 0,\n`;
        dump += `    pv INTEGER NOT NULL DEFAULT 5,\n`;
        dump += `    pv_max INTEGER NOT NULL DEFAULT 5,\n`;
        dump += `    pociones INTEGER NOT NULL DEFAULT 1,\n`;
        dump += `    aciertos INTEGER NOT NULL DEFAULT 0,\n`;
        dump += `    errores INTEGER NOT NULL DEFAULT 0,\n`;
        dump += `    escudo INTEGER NOT NULL DEFAULT 0,\n`;
        dump += `    piedra INTEGER NOT NULL DEFAULT 0,\n`;
        dump += `    alas INTEGER NOT NULL DEFAULT 0,\n`;
        dump += `    llave INTEGER NOT NULL DEFAULT 0,\n`;
        dump += `    estado TEXT NOT NULL DEFAULT 'En progreso',\n`;
        dump += `    fecha_registro TEXT NOT NULL,\n`;
        dump += `    ultima_actualizacion TEXT NOT NULL\n);\n\n`;

        players.forEach(p => {
            const safeName = String(p.nombre).replace(/'/g, "''");
            const safeState = String(p.estado).replace(/'/g, "''");
            dump += `INSERT INTO jugadores (id, nombre, nivel_actual, puntos, puntos_nivel_disp, bonus_rapidos, pv, pv_max, pociones, aciertos, errores, escudo, piedra, alas, llave, estado, fecha_registro, ultima_actualizacion) VALUES (${p.id}, '${safeName}', ${p.nivel_actual}, ${p.puntos || 0}, ${p.puntos_nivel_disp ?? 500}, ${p.bonus_rapidos || 0}, ${p.pv}, ${p.pv_max}, ${p.pociones}, ${p.aciertos}, ${p.errores}, ${p.escudo}, ${p.piedra}, ${p.alas}, ${p.llave}, '${safeState}', '${p.fecha_registro}', '${p.ultima_actualizacion}');\n`;
        });
        return dump;
    }
}

const sqlDB = new SQLDatabaseManager();

// ============================================================================
// 6. ESTADO GLOBAL DEL JUEGO Y REFERENCIAS DEL DOM
// ============================================================================
const BASE_LEVEL_POINTS = 500;
const SPEED_BONUS_POINTS = 80;
const SPEED_BONUS_WINDOW_SEC = 8.0;

const gameState = {
    playerId: null,
    playerName: "Sir BioAlquimista",
    currentLevelIndex: 0, // 0 a 14 (15 niveles)
    score: 0,
    levelAvailablePoints: BASE_LEVEL_POINTS, // 500 pts base por nivel, -20% (-100 pts) por cada fallo
    levelMistakes: 0,
    levelStartTime: 0,
    speedTimerInterval: null,
    fastBonusesWon: 0,
    hp: 5,
    maxHp: 5,
    potions: 1,
    correctCount: 0,
    wrongCount: 0,
    hasShield: false,
    hasStone: false,
    hasWings: false,
    hasKey: false,
    statusText: "En progreso (Nivel 1)",
    answeredCurrent: false
};

const dom = {
    // Pantalla de Carga y Perfiles
    loadingAuthScreen: document.getElementById("loading-auth-screen"),
    loaderStatusText: document.getElementById("loader-status-text"),
    loaderPercentText: document.getElementById("loader-percent-text"),
    bootBarFill: document.getElementById("boot-bar-fill"),
    profileSelectorContainer: document.getElementById("profile-selector-container"),
    tabBtnPlayer: document.getElementById("tab-btn-player"),
    tabBtnAdmin: document.getElementById("tab-btn-admin"),
    panelPlayerAuth: document.getElementById("panel-player-auth"),
    panelAdminAuth: document.getElementById("panel-admin-auth"),
    inputPlayerName: document.getElementById("input-player-name"),
    existingPlayersPills: document.getElementById("existing-players-pills"),
    playerAuthError: document.getElementById("player-auth-error"),
    btnLoginPlayer: document.getElementById("btn-login-player"),
    inputAdminPass: document.getElementById("input-admin-pass"),
    adminAuthError: document.getElementById("admin-auth-error"),
    btnLoginAdmin: document.getElementById("btn-login-admin"),

    // Modal de Administrador SQL
    modalAdminDashboard: document.getElementById("modal-admin-dashboard"),
    kpiTotalPlayers: document.getElementById("kpi-total-players"),
    kpiAvgLevel: document.getElementById("kpi-avg-level"),
    kpiGlobalAccuracy: document.getElementById("kpi-global-accuracy"),
    kpiCompletedGames: document.getElementById("kpi-completed-games"),
    customSqlInput: document.getElementById("custom-sql-input"),
    btnExecSql: document.getElementById("btn-exec-sql"),
    btnRunDefaultSql: document.getElementById("btn-run-default-sql"),
    btnRunRankingSql: document.getElementById("btn-run-ranking-sql"),
    adminPlayersTbody: document.getElementById("admin-players-tbody"),
    btnExportSql: document.getElementById("btn-export-sql"),
    btnCloseAdmin: document.getElementById("btn-close-admin"),

    // HUD, Contador de Puntos y Escenario
    hudHeroName: document.getElementById("hud-hero-name"),
    stageHeroPlate: document.getElementById("stage-hero-plate"),
    hudTotalScore: document.getElementById("hud-total-score"),
    hpText: document.getElementById("hp-text"),
    hpBarFill: document.getElementById("hp-bar-fill"),
    heartsRow: document.getElementById("hearts-row"),
    biomeBadge: document.getElementById("biome-badge"),
    levelIndicator: document.getElementById("level-indicator"),
    missionText: document.getElementById("mission-text"),
    potionBtn: document.getElementById("btn-potion"),
    potionCount: document.getElementById("potion-count"),
    slotShield: document.getElementById("slot-shield"),
    slotStone: document.getElementById("slot-stone"),
    slotWings: document.getElementById("slot-wings"),
    slotKey: document.getElementById("slot-key"),
    nodesTrack: document.getElementById("dungeon-nodes-track"),
    battleStage: document.getElementById("battle-stage"),
    activeBuffs: document.getElementById("active-buffs"),
    heroActor: document.getElementById("hero-actor"),
    heroDmgText: document.getElementById("hero-dmg-text"),
    heroShieldAura: document.getElementById("hero-shield-aura"),
    heroWingsBack: document.getElementById("hero-wings-back"),
    enemyActor: document.getElementById("enemy-actor"),
    enemyDmgText: document.getElementById("enemy-dmg-text"),
    enemySvgWrapper: document.getElementById("enemy-svg-wrapper"),
    enemyNamePlate: document.getElementById("enemy-name-plate"),
    conceptTitle: document.getElementById("concept-title"),
    conceptSvgContainer: document.getElementById("concept-svg-container"),
    dungeonGate: document.getElementById("dungeon-gate"),
    gateDoors: document.getElementById("gate-doors"),
    gateFloatingText: document.getElementById("gate-Floating-text"),

    // Píldoras y Popup Rápido de Puntos por Nivel
    levelAvailablePts: document.getElementById("level-available-pts"),
    speedBonusTimer: document.getElementById("speed-bonus-timer"),
    levelScorePopup: document.getElementById("level-score-popup"),
    popupPointsEarned: document.getElementById("popup-points-earned"),
    popupPointsBreakdown: document.getElementById("popup-points-breakdown"),
    popupRunningTotal: document.getElementById("popup-running-total"),

    qNumberPill: document.getElementById("q-number-pill"),
    qActionPreview: document.getElementById("q-action-preview"),
    qNarrative: document.getElementById("q-narrative"),
    optionsContainer: document.getElementById("options-container"),
    feedbackBox: document.getElementById("feedback-box"),
    feedbackIcon: document.getElementById("feedback-icon"),
    feedbackTitle: document.getElementById("feedback-title"),
    feedbackExplanation: document.getElementById("feedback-explanation"),
    feedbackActionResult: document.getElementById("feedback-action-result"),
    btnNextLevel: document.getElementById("btn-next-level"),
    modalOverlay: document.getElementById("modal-overlay"),
    modalMainTitle: document.getElementById("modal-main-title"),
    modalSubTitle: document.getElementById("modal-sub-title"),
    modalDescription: document.getElementById("modal-description"),
    btnStartGame: document.getElementById("btn-start-game"),
    modalMap: document.getElementById("modal-map"),
    fullMapGrid: document.getElementById("full-map-grid"),
    btnSwitchProfile: document.getElementById("btn-switch-profile"),
    btnMap: document.getElementById("btn-map"),
    btnCloseMap: document.getElementById("btn-close-map"),
    btnAudio: document.getElementById("btn-audio")
};

// ============================================================================
// 7. FUNCIONES DE PANTALLA DE CARGA, AUTENTICACIÓN Y PANEL ADMIN SQL
// ============================================================================
function runBootLoadingSequence() {
    const steps = [
        { pct: 20, msg: "Cargando motor SQLite WebAssembly y esquemas..." },
        { pct: 48, msg: "Verificando tabla SQL 'jugadores' e índices primarios..." },
        { pct: 76, msg: "Renderizando los 15 niveles y animaciones biológicas..." },
        { pct: 100, msg: "¡Motor SQL listo! Selecciona tu perfil para comenzar." }
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i < steps.length) {
            dom.bootBarFill.style.width = `${steps[i].pct}%`;
            dom.loaderPercentText.textContent = `${steps[i].pct}%`;
            dom.loaderStatusText.textContent = steps[i].msg;
            i++;
        } else {
            clearInterval(interval);
            dom.profileSelectorContainer.classList.remove("hidden");
            renderExistingPlayerPills();
        }
    }, 280);
}

function renderExistingPlayerPills() {
    const players = sqlDB.executeQuery("SELECT * FROM jugadores ORDER BY id ASC;");
    dom.existingPlayersPills.innerHTML = "";
    if (players.length === 0) return;

    players.forEach(p => {
        const pill = document.createElement("span");
        pill.className = "player-quick-pill";
        pill.textContent = `ID #${p.id} · ${p.nombre} (Nvl ${p.nivel_actual} · 🏆 ${p.puntos || 0} pts)`;
        pill.title = "Haz clic para cargar este jugador";
        pill.addEventListener("click", () => {
            dom.inputPlayerName.value = p.nombre;
        });
        dom.existingPlayersPills.appendChild(pill);
    });
}

// Alternar pestañas Jugador / Administrador en la pantalla de carga
dom.tabBtnPlayer.addEventListener("click", () => {
    dom.tabBtnPlayer.classList.add("active");
    dom.tabBtnAdmin.classList.remove("active");
    dom.panelPlayerAuth.classList.remove("hidden");
    dom.panelAdminAuth.classList.add("hidden");
    renderExistingPlayerPills();
});

dom.tabBtnAdmin.addEventListener("click", () => {
    dom.tabBtnAdmin.classList.add("active");
    dom.tabBtnPlayer.classList.remove("active");
    dom.panelAdminAuth.classList.remove("hidden");
    dom.panelPlayerAuth.classList.add("hidden");
    dom.inputAdminPass.focus();
});

// Ingreso / Registro de Jugador
function handlePlayerLogin() {
    const rawName = dom.inputPlayerName.value.trim();
    if (!rawName) {
        dom.playerAuthError.textContent = "⚠️ Por favor escribe un nombre para tu héroe antes de entrar.";
        dom.playerAuthError.classList.remove("hidden");
        return;
    }
    dom.playerAuthError.classList.add("hidden");

    const playerRecord = sqlDB.registerOrGetPlayer(rawName);
    gameState.playerId = playerRecord.id;
    gameState.playerName = playerRecord.nombre;
    gameState.currentLevelIndex = Math.min(14, Math.max(0, (playerRecord.nivel_actual || 1) - 1));
    gameState.score = Number(playerRecord.puntos) || 0;
    gameState.levelAvailablePoints = Number(playerRecord.puntos_nivel_disp) || BASE_LEVEL_POINTS;
    gameState.fastBonusesWon = Number(playerRecord.bonus_rapidos) || 0;
    gameState.hp = playerRecord.pv > 0 ? playerRecord.pv : 5;
    gameState.maxHp = playerRecord.pv_max || 5;
    gameState.potions = playerRecord.pociones ?? 1;
    gameState.correctCount = playerRecord.aciertos ?? 0;
    gameState.wrongCount = playerRecord.errores ?? 0;
    gameState.hasShield = Boolean(playerRecord.escudo);
    gameState.hasStone = Boolean(playerRecord.piedra);
    gameState.hasWings = Boolean(playerRecord.alas);
    gameState.hasKey = Boolean(playerRecord.llave);
    gameState.statusText = `Jugando Nivel ${gameState.currentLevelIndex + 1}`;

    sqlDB.updatePlayerProgress(gameState);

    dom.loadingAuthScreen.classList.add("hidden");
    sfx.init();
    sfx.playPotionHeal();
    loadCurrentLevel();
}

dom.btnLoginPlayer.addEventListener("click", handlePlayerLogin);
dom.inputPlayerName.addEventListener("keydown", e => {
    if (e.key === "Enter") handlePlayerLogin();
});

// Ingreso de Administrador (Contraseña: holamama) -> Abre ventana nueva con toda la información SQL en tiempo real
function handleAdminLogin() {
    const pass = dom.inputAdminPass.value.trim();
    if (pass === ADMIN_SECRET_PASS) {
        dom.adminAuthError.classList.add("hidden");
        dom.inputAdminPass.value = "";
        sfx.init();
        sfx.playSwordAndTriumph();

        // Abrir el Panel SQL en una ventana/pestaña nueva dedicada (admin.html)
        const adminWin = window.open("admin.html", "_blank");
        if (!adminWin) {
            // Si el navegador bloquea popups, redirigir o abrir el modal de respaldo
            window.location.href = "admin.html";
        }
    } else {
        dom.adminAuthError.classList.remove("hidden");
        sfx.playDamageHit();
    }
}

dom.btnLoginAdmin.addEventListener("click", handleAdminLogin);
dom.inputAdminPass.addEventListener("keydown", e => {
    if (e.key === "Enter") handleAdminLogin();
});

// Renderizado en Tiempo Real del Panel de Administrador SQL
let adminRefreshTimer = null;

function openAdminDashboard() {
    dom.modalAdminDashboard.classList.remove("hidden");
    refreshAdminDashboardTable();
    if (adminRefreshTimer) clearInterval(adminRefreshTimer);
    adminRefreshTimer = setInterval(() => {
        if (!dom.modalAdminDashboard.classList.contains("hidden")) {
            refreshAdminDashboardTable();
        }
    }, 1500);
}

function refreshAdminDashboardTable(customQuery) {
    const queryStr = customQuery || dom.customSqlInput.value || "SELECT * FROM jugadores ORDER BY id ASC;";
    let rows = [];
    try {
        rows = sqlDB.executeQuery(queryStr);
    } catch (err) {
        rows = sqlDB.executeQuery("SELECT * FROM jugadores ORDER BY id ASC;");
    }

    // Calcular KPIs globales sobre todos los jugadores
    const allPlayers = sqlDB.executeQuery("SELECT * FROM jugadores ORDER BY id ASC;");
    dom.kpiTotalPlayers.textContent = allPlayers.length;

    if (allPlayers.length > 0) {
        const avgLvl = (allPlayers.reduce((acc, p) => acc + (Number(p.nivel_actual) || 1), 0) / allPlayers.length).toFixed(1);
        dom.kpiAvgLevel.textContent = `Nivel ${avgLvl}`;

        const totalHits = allPlayers.reduce((acc, p) => acc + (Number(p.aciertos) || 0), 0);
        const totalMiss = allPlayers.reduce((acc, p) => acc + (Number(p.errores) || 0), 0);
        const globalAcc = totalHits + totalMiss > 0
            ? ((totalHits / (totalHits + totalMiss)) * 100).toFixed(1)
            : "100.0";
        dom.kpiGlobalAccuracy.textContent = `${globalAcc}%`;

        const completedCount = allPlayers.filter(p => String(p.estado).includes("Victoria")).length;
        dom.kpiCompletedGames.textContent = completedCount;
    } else {
        dom.kpiAvgLevel.textContent = "Nivel 1";
        dom.kpiGlobalAccuracy.textContent = "0%";
        dom.kpiCompletedGames.textContent = "0";
    }

    // Llenar tabla SQL
    dom.adminPlayersTbody.innerHTML = "";
    if (rows.length === 0) {
        dom.adminPlayersTbody.innerHTML = `
            <tr>
                <td colspan="12" style="text-align:center; padding:22px; color:#94a3b8;">
                    No hay jugadores registrados aún. Registra un jugador en la pestaña "Perfil de Jugador" para ver sus estadísticas en tiempo real.
                </td>
            </tr>
        `;
        return;
    }

    rows.forEach(p => {
        const hits = Number(p.aciertos) || 0;
        const miss = Number(p.errores) || 0;
        const acc = hits + miss > 0 ? ((hits / (hits + miss)) * 100).toFixed(1) + "%" : "—";
        const pts = Number(p.puntos) || 0;
        const availPts = p.puntos_nivel_disp ?? 500;
        const fastCount = Number(p.bonus_rapidos) || 0;

        const relics = [
            p.escudo ? "🛡️" : "",
            p.piedra ? "💎" : "",
            p.alas ? "🦇" : "",
            p.llave ? "🗝️" : ""
        ].filter(Boolean).join(" ") || "Ninguna";

        let statusClass = "playing";
        if (String(p.estado).includes("Victoria")) statusClass = "victory";
        else if (String(p.estado).includes("Derrotado")) statusClass = "defeated";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong style="color:#fbbf24;">#${p.id}</strong></td>
            <td><strong>${p.nombre}</strong></td>
            <td>
                <strong style="color:#fde047;">🏆 ${pts} pts</strong>
                <div style="font-size:0.72rem; color:#a7f3d0;">🎯 Nivel: ${availPts} pts · ⚡ Bonus: ${fastCount}</div>
            </td>
            <td><span style="color:#38bdf8; font-weight:700;">Nivel ${p.nivel_actual} / 15</span></td>
            <td>❤️ ${p.pv} / ${p.pv_max || 5}</td>
            <td>🧪 ${p.pociones ?? 0}</td>
            <td style="color:#34d399; font-weight:700;">✔ ${hits}</td>
            <td style="color:#f87171; font-weight:700;">✖ ${miss}</td>
            <td><strong>${acc}</strong></td>
            <td>${relics}</td>
            <td><span class="status-pill ${statusClass}">${p.estado}</span></td>
            <td style="color:#94a3b8; font-size:0.78rem;">${p.ultima_actualizacion || "—"}</td>
        `;
        dom.adminPlayersTbody.appendChild(tr);
    });
}

dom.btnExecSql.addEventListener("click", () => {
    refreshAdminDashboardTable(dom.customSqlInput.value);
});

dom.btnRunDefaultSql.addEventListener("click", () => {
    dom.customSqlInput.value = "SELECT * FROM jugadores ORDER BY id ASC;";
    refreshAdminDashboardTable(dom.customSqlInput.value);
});

dom.btnRunRankingSql.addEventListener("click", () => {
    dom.customSqlInput.value = "SELECT * FROM jugadores ORDER BY puntos DESC, nivel_actual DESC, aciertos DESC;";
    refreshAdminDashboardTable(dom.customSqlInput.value);
});

dom.btnExportSql.addEventListener("click", () => {
    const sqlContent = sqlDB.exportSQLDump();
    const blob = new Blob([sqlContent], { type: "application/sql;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jugadores_dinamica_quimica.sql";
    a.click();
    URL.revokeObjectURL(url);
});

dom.btnCloseAdmin.addEventListener("click", () => {
    dom.modalAdminDashboard.classList.add("hidden");
    if (adminRefreshTimer) clearInterval(adminRefreshTimer);
});

// Escuchar actualizaciones en tiempo real de otras pestañas abiertas
if (sqlDB.channel) {
    sqlDB.channel.onmessage = () => {
        if (!dom.modalAdminDashboard.classList.contains("hidden")) {
            refreshAdminDashboardTable();
        }
    };
}
window.addEventListener("storage", () => {
    if (!dom.modalAdminDashboard.classList.contains("hidden")) {
        refreshAdminDashboardTable();
    }
});

// Botón en el HUD para volver a la pantalla de perfiles (cambiar jugador o abrir Admin)
dom.btnSwitchProfile.addEventListener("click", () => {
    stopSpeedBonusTimer();
    renderExistingPlayerPills();
    dom.loadingAuthScreen.classList.remove("hidden");
});

// ============================================================================
// 8. FUNCIONES DE RENDERIZADO DEL HUD, CONTADOR DE PUNTOS Y NIVEL ACTUAL
// ============================================================================
function updateHUD() {
    const idTag = gameState.playerId ? `ID #${gameState.playerId} · ` : "";
    dom.hudHeroName.textContent = `${idTag}${gameState.playerName}`;
    dom.stageHeroPlate.textContent = `${idTag}${gameState.playerName}`;

    // Actualizar contador de puntos acumulado en el HUD
    if (dom.hudTotalScore) {
        dom.hudTotalScore.textContent = gameState.score;
    }

    // Actualizar píldora de puntos disponibles para el nivel actual
    if (dom.levelAvailablePts) {
        dom.levelAvailablePts.innerHTML = `🎯 Puntos Nivel: <strong>${gameState.levelAvailablePoints}</strong> pts`;
    }

    dom.hpText.textContent = `${gameState.hp} / ${gameState.maxHp} PV`;
    const pct = Math.max(0, (gameState.hp / gameState.maxHp) * 100);
    dom.hpBarFill.style.width = `${pct}%`;

    // Corazones
    dom.heartsRow.innerHTML = "";
    for (let i = 1; i <= gameState.maxHp; i++) {
        const span = document.createElement("span");
        span.className = `heart-icon ${i > gameState.hp ? "lost" : ""}`;
        span.textContent = "❤️";
        dom.heartsRow.appendChild(span);
    }

    // Pociones y reliquias
    dom.potionCount.textContent = gameState.potions;
    dom.slotShield.className = `inv-slot ${gameState.hasShield ? "unlocked" : "locked"}`;
    dom.slotStone.className = `inv-slot ${gameState.hasStone ? "unlocked" : "locked"}`;
    dom.slotWings.className = `inv-slot ${gameState.hasWings ? "unlocked" : "locked"}`;
    dom.slotKey.className = `inv-slot ${gameState.hasKey ? "unlocked" : "locked"}`;

    // Aura visual de escudo y alas en el personaje
    dom.heroShieldAura.classList.toggle("hidden", !gameState.hasShield);
    dom.heroWingsBack.classList.toggle("hidden", !gameState.hasWings);

    // Píldoras de estado en escenario
    dom.activeBuffs.innerHTML = "";
    if (gameState.hasShield) {
        dom.activeBuffs.innerHTML += `<div class="buff-pill">🛡️ Aliado Simbiótico Activo</div>`;
    }
    if (gameState.hasStone) {
        dom.activeBuffs.innerHTML += `<div class="buff-pill">💎 Espada del Carbono (+Poder)</div>`;
    }
    if (gameState.hasWings) {
        dom.activeBuffs.innerHTML += `<div class="buff-pill">🦇 Vuelo Quiróptero</div>`;
    }
}

// Temporizador de los primeros 8 segundos para el Bonus de +80 puntos
function startSpeedBonusTimer() {
    stopSpeedBonusTimer();
    gameState.levelStartTime = performance.now();

    if (dom.speedBonusTimer) {
        dom.speedBonusTimer.classList.remove("bonus-expired");
        dom.speedBonusTimer.innerHTML = `⏱️ Bonus +${SPEED_BONUS_POINTS} pts: <strong>8.0s</strong>`;
    }

    gameState.speedTimerInterval = setInterval(() => {
        if (gameState.answeredCurrent) {
            stopSpeedBonusTimer();
            return;
        }
        const elapsedSec = (performance.now() - gameState.levelStartTime) / 1000;
        const remainingSec = Math.max(0, SPEED_BONUS_WINDOW_SEC - elapsedSec);

        if (remainingSec > 0) {
            if (dom.speedBonusTimer) {
                dom.speedBonusTimer.innerHTML = `⏱️ Bonus +${SPEED_BONUS_POINTS} pts: <strong>${remainingSec.toFixed(1)}s</strong>`;
            }
        } else {
            if (dom.speedBonusTimer) {
                dom.speedBonusTimer.classList.add("bonus-expired");
                dom.speedBonusTimer.innerHTML = `⏱️ Bonus +${SPEED_BONUS_POINTS} pts: <strong>Expirado (0.0s)</strong>`;
            }
            stopSpeedBonusTimer();
        }
    }, 100);
}

function stopSpeedBonusTimer() {
    if (gameState.speedTimerInterval) {
        clearInterval(gameState.speedTimerInterval);
        gameState.speedTimerInterval = null;
    }
}

// Muestra rápidamente el panel de puntos ganados al vencer el nivel
let levelPopupTimeout = null;
function showQuickLevelScorePopup(earnedPoints, basePointsAfterPenalty, bonusPoints, mistakesCount, totalScore) {
    if (!dom.levelScorePopup) return;
    if (levelPopupTimeout) clearTimeout(levelPopupTimeout);

    dom.popupPointsEarned.textContent = `+${earnedPoints} PUNTOS`;

    const parts = [];
    if (mistakesCount === 0) {
        parts.push(`🎯 Nivel vencido sin fallos: +${BASE_LEVEL_POINTS} pts`);
    } else {
        const deducted = BASE_LEVEL_POINTS - basePointsAfterPenalty;
        parts.push(`🎯 Base Nivel: ${BASE_LEVEL_POINTS} pts (-${deducted} pts por ${mistakesCount} fallo${mistakesCount > 1 ? "s" : ""} [-20% c/u]) = +${basePointsAfterPenalty} pts`);
    }

    if (bonusPoints > 0) {
        parts.push(`⚡ ¡Bonus Rápido (<8s): +${bonusPoints} pts!`);
    } else {
        parts.push(`⏱️ Bonus Rápido (<8s): +0 pts`);
    }

    dom.popupPointsBreakdown.innerHTML = parts.join("<br>");
    dom.popupRunningTotal.textContent = `Total Acumulado: ${totalScore} pts`;

    dom.levelScorePopup.classList.remove("hidden", "show-score-popup");
    void dom.levelScorePopup.offsetWidth;
    dom.levelScorePopup.classList.add("show-score-popup");

    levelPopupTimeout = setTimeout(() => {
        dom.levelScorePopup.classList.add("hidden");
        dom.levelScorePopup.classList.remove("show-score-popup");
    }, 2900);
}

function renderDungeonProgressBar() {
    dom.nodesTrack.innerHTML = "";
    DUNGEON_LEVELS.forEach((lvl, idx) => {
        const node = document.createElement("div");
        const isCompleted = idx < gameState.currentLevelIndex;
        const isCurrent = idx === gameState.currentLevelIndex;
        const isBoss = idx === 14;

        node.className = `dungeon-node ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isBoss ? "boss-node" : ""}`;
        node.title = `Nivel ${lvl.level}: ${lvl.questionTitle}`;
        node.innerHTML = `
            <div class="node-circle">${isBoss ? "🗿" : (isCompleted ? "✓" : lvl.level)}</div>
            <span class="node-label">${isBoss ? "JEFE" : "N" + lvl.level}</span>
        `;
        dom.nodesTrack.appendChild(node);

        if (idx < DUNGEON_LEVELS.length - 1) {
            const conn = document.createElement("div");
            conn.className = `node-connector ${isCompleted ? "completed" : ""}`;
            dom.nodesTrack.appendChild(conn);
        }
    });
}

function loadCurrentLevel() {
    gameState.answeredCurrent = false;
    gameState.levelAvailablePoints = BASE_LEVEL_POINTS; // 500 puntos disponibles al iniciar el nivel
    gameState.levelMistakes = 0;

    if (dom.levelScorePopup) {
        dom.levelScorePopup.classList.add("hidden");
        dom.levelScorePopup.classList.remove("show-score-popup");
    }

    const data = DUNGEON_LEVELS[gameState.currentLevelIndex];

    // Cabecera y Bioma
    dom.biomeBadge.textContent = data.actTitle;
    dom.levelIndicator.textContent = `Nivel ${data.level} de 15`;
    dom.missionText.textContent = data.mission;
    dom.battleStage.setAttribute("data-biome", data.biomeId);

    // Enemigo (15 Skins únicas temáticas por nivel + Golem Gigante en Nivel 15)
    dom.enemyActor.classList.remove("enemy-defeated-anim", "enemy-electrocuted");
    dom.enemySvgWrapper.className = `enemy-svg-wrapper ${data.enemyType === "bossGolem" ? "boss-golem-scale" : ""}`;
    dom.enemySvgWrapper.innerHTML = getEnemySVG(data.enemyType, data.level);
    dom.enemyNamePlate.textContent = data.enemyName;

    // Visor Holográfico de Concepto Biológico
    dom.conceptTitle.textContent = data.conceptTitle;
    dom.conceptSvgContainer.innerHTML = getBiologicalConceptSVG(data.level);

    // Cuadro de pregunta y opciones
    dom.qNumberPill.textContent = data.questionTitle;
    dom.qActionPreview.textContent = "⚡ Elige la respuesta correcta para lanzar tu ataque";
    dom.qNarrative.textContent = data.narrative;

    dom.optionsContainer.innerHTML = "";
    ["A", "B", "C"].forEach(letter => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.dataset.option = letter;
        btn.innerHTML = `
            <span class="option-letter">${letter}</span>
            <span>${data.options[letter]}</span>
        `;
        btn.addEventListener("click", () => handleAnswerSelection(letter, btn));
        dom.optionsContainer.appendChild(btn);
    });

    dom.feedbackBox.classList.add("hidden");
    updateHUD();
    renderDungeonProgressBar();
    startSpeedBonusTimer();
}

// ============================================================================
// 9. LÓGICA DE COMBATE, PUNTUACIÓN, RESPUESTAS, POCIONES Y PUERTA ANIMADA
// ============================================================================
function showFloatingText(element, text, color) {
    element.textContent = text;
    element.style.color = color;
    element.classList.remove("show-dmg");
    void element.offsetWidth; // reflow
    element.classList.add("show-dmg");
}

function handleAnswerSelection(selectedLetter, btnElement) {
    if (gameState.answeredCurrent) return;
    const data = DUNGEON_LEVELS[gameState.currentLevelIndex];

    const combatFxLayer = document.getElementById("combat-fx-layer");
    const heroSmashFx = document.getElementById("hero-smash-fx");

    if (selectedLetter === data.correct) {
        // ¡RESPUESTA CORRECTA! -> ATAQUE DE RAYO ELÉCTRICO + CÁLCULO DE PUNTOS Y BONUS DE 8 SEGUNDOS
        gameState.answeredCurrent = true;
        const elapsedSeconds = (performance.now() - gameState.levelStartTime) / 1000;
        stopSpeedBonusTimer();

        const earnedSpeedBonus = elapsedSeconds <= SPEED_BONUS_WINDOW_SEC ? SPEED_BONUS_POINTS : 0;
        if (earnedSpeedBonus > 0) {
            gameState.fastBonusesWon += 1;
            if (dom.speedBonusTimer) {
                dom.speedBonusTimer.innerHTML = `⚡ ¡Bonus +${SPEED_BONUS_POINTS} pts ganado (${elapsedSeconds.toFixed(1)}s)!`;
            }
        }

        const totalLevelPoints = gameState.levelAvailablePoints + earnedSpeedBonus;
        gameState.score += totalLevelPoints;
        gameState.correctCount += 1;

        btnElement.classList.add("correct-choice");
        disableAllOptionButtons();

        // Animar incremento en el badge de puntos del HUD
        if (dom.hudTotalScore) {
            const scoreBadge = dom.hudTotalScore.closest(".hud-score-badge");
            if (scoreBadge) {
                scoreBadge.classList.remove("score-bump");
                void scoreBadge.offsetWidth;
                scoreBadge.classList.add("score-bump");
            }
        }

        // Mostrar rápidamente el panel de puntos ganados al vencer el nivel
        showQuickLevelScorePopup(
            totalLevelPoints,
            gameState.levelAvailablePoints,
            earnedSpeedBonus,
            gameState.levelMistakes,
            gameState.score
        );

        // Sonido y animación del Héroe canalizando y disparando el Rayo Eléctrico
        sfx.playSwordAndTriumph();
        dom.heroActor.classList.add("hero-lightning-cast");

        if (combatFxLayer) {
            combatFxLayer.classList.remove("hidden", "active-lightning");
            void combatFxLayer.offsetWidth;
            combatFxLayer.classList.add("active-lightning");
        }

        setTimeout(() => {
            dom.enemyActor.classList.add("enemy-electrocuted");
            showFloatingText(dom.enemyDmgText, `⚡ +${totalLevelPoints} PTS!`, "#38bdf8");
        }, 160);

        setTimeout(() => {
            if (combatFxLayer) {
                combatFxLayer.classList.remove("active-lightning");
                combatFxLayer.classList.add("hidden");
            }
            dom.heroActor.classList.remove("hero-lightning-cast");
            dom.heroActor.classList.add("hero-triumph-jump");
            dom.enemyActor.classList.remove("enemy-electrocuted");
            dom.enemyActor.classList.add("enemy-defeated-anim");
            setTimeout(() => dom.heroActor.classList.remove("hero-triumph-jump"), 1200);
        }, 820);

        // Aplicar recompensas e implementos mágicos según la pregunta
        applyQuestionReward(data.rewardType);

        if (data.level === 15) {
            gameState.statusText = "🏆 Victoria Completa";
        } else {
            gameState.statusText = `Superó Nivel ${data.level}`;
        }
        sqlDB.updatePlayerProgress(gameState);

        // Mostrar retroalimentación científica y resumen de puntos del nivel
        dom.feedbackIcon.textContent = "⚡";
        dom.feedbackTitle.textContent = `¡Respuesta Correcta (${data.correct})! +${totalLevelPoints} Puntos Ganados`;
        dom.feedbackExplanation.textContent = data.explanation;
        dom.feedbackActionResult.textContent = `${data.playerAction} (🏆 +${gameState.levelAvailablePoints} pts nivel${earnedSpeedBonus > 0 ? ` + ${earnedSpeedBonus} pts bonus <8s` : ""})`;
        dom.btnNextLevel.textContent = data.level === 15
            ? "🏆 Ver Ventana Final de Puntuación y Cofre"
            : `🚪 Abrir Puerta al Nivel ${data.level + 1} ➔`;
        dom.feedbackBox.classList.remove("hidden");

        updateHUD();
    } else {
        // RESPUESTA INCORRECTA -> DESCUENTO DEL 20% DE LOS PUNTOS DISPONIBLES POR VENCER EL NIVEL + IMPACTO SMASH
        gameState.wrongCount += 1;
        gameState.levelMistakes += 1;

        // Descontar el 20% de los 500 puntos base disponibles para este nivel (-100 puntos por cada fallo)
        const penaltyPoints = Math.round(BASE_LEVEL_POINTS * 0.20); // 100 puntos (20% de 500)
        gameState.levelAvailablePoints = Math.max(0, gameState.levelAvailablePoints - penaltyPoints);

        if (dom.levelAvailablePts) {
            dom.levelAvailablePts.classList.remove("penalty-flash");
            void dom.levelAvailablePts.offsetWidth;
            dom.levelAvailablePts.classList.add("penalty-flash");
        }

        btnElement.classList.add("wrong-choice");
        btnElement.disabled = true;
        sfx.playDamageHit();

        // Verificar si tiene el Escudo Simbiótico de la Pregunta 3
        if (gameState.hasShield) {
            gameState.hasShield = false;
            showFloatingText(dom.heroDmgText, `🛡️ BLOQUEADO (-${penaltyPoints} PTS)`, "#38bdf8");
        } else {
            gameState.hp = Math.max(0, gameState.hp - 1);
            showFloatingText(dom.heroDmgText, `💥 -1 PV | -20% (-${penaltyPoints} PTS)`, "#ef4444");
        }

        // Activar explosión estelar Smash + esquirlas de armadura + knockback
        if (heroSmashFx) {
            heroSmashFx.classList.remove("hidden", "active-smash");
            void heroSmashFx.offsetWidth;
            heroSmashFx.classList.add("active-smash");
        }

        dom.heroActor.classList.remove("hero-armor-smash-hit");
        void dom.heroActor.offsetWidth;
        dom.heroActor.classList.add("hero-armor-smash-hit");

        dom.battleStage.classList.remove("stage-smash-shake");
        void dom.battleStage.offsetWidth;
        dom.battleStage.classList.add("stage-smash-shake");

        setTimeout(() => {
            dom.heroActor.classList.remove("hero-armor-smash-hit");
            dom.battleStage.classList.remove("stage-smash-shake");
            if (heroSmashFx) {
                heroSmashFx.classList.remove("active-smash");
                heroSmashFx.classList.add("hidden");
            }
        }, 720);

        if (gameState.hp <= 0) {
            gameState.statusText = `💀 Derrotado en Nivel ${data.level}`;
            stopSpeedBonusTimer();
        }
        sqlDB.updatePlayerProgress(gameState);
        updateHUD();

        // Comprobar si perdió todas las vidas
        if (gameState.hp <= 0) {
            setTimeout(() => showGameOverModal(), 750);
        }
    }
}

function applyQuestionReward(rewardType) {
    switch (rewardType) {
        case "potion":
            gameState.potions += 1;
            showFloatingText(dom.heroDmgText, "+1 🧪 POCIÓN", "#ec4899");
            break;
        case "shield":
            gameState.hasShield = true;
            showFloatingText(dom.heroDmgText, "🛡️ ALIADO SIMBIÓTICO", "#38bdf8");
            break;
        case "instantHeal":
            if (gameState.hp < gameState.maxHp) {
                gameState.hp = Math.min(gameState.maxHp, gameState.hp + 1);
                showFloatingText(dom.heroDmgText, "+1 PV ⛲ FUENTE", "#10b981");
            } else {
                gameState.potions += 1;
                showFloatingText(dom.heroDmgText, "PV MÁX (+1 🧪)", "#10b981");
            }
            break;
        case "stone":
            gameState.hasStone = true;
            showFloatingText(dom.heroDmgText, "💎 PIEDRA CARBONO", "#34d399");
            break;
        case "wings":
            gameState.hasWings = true;
            showFloatingText(dom.heroDmgText, "🦇 ALAS MÁGICAS", "#a855f7");
            break;
        case "key":
            gameState.hasKey = true;
            showFloatingText(dom.heroDmgText, "🗝️ LLAVE FINAL", "#fbbf24");
            break;
    }
}

function disableAllOptionButtons() {
    const buttons = dom.optionsContainer.querySelectorAll(".option-btn");
    buttons.forEach(b => (b.disabled = true));
}

// Uso de Pociones para restaurar salud inmediata
dom.potionBtn.addEventListener("click", () => {
    if (gameState.potions <= 0) {
        showFloatingText(dom.heroDmgText, "¡Sin pociones!", "#94a3b8");
        return;
    }
    if (gameState.hp >= gameState.maxHp) {
        showFloatingText(dom.heroDmgText, "¡Salud al máximo!", "#38bdf8");
        return;
    }
    gameState.potions -= 1;
    gameState.hp = Math.min(gameState.maxHp, gameState.hp + 1);
    sfx.playPotionHeal();
    showFloatingText(dom.heroDmgText, "+1 PV 🧪 SALUD", "#10b981");
    sqlDB.updatePlayerProgress(gameState);
    updateHUD();
});

// Transición por la Puerta Animada hacia el siguiente nivel
dom.btnNextLevel.addEventListener("click", () => {
    if (dom.levelScorePopup) {
        dom.levelScorePopup.classList.add("hidden");
    }

    if (gameState.currentLevelIndex === 14) {
        showVictoryModal();
        return;
    }

    const nextLvlNum = gameState.currentLevelIndex + 2;
    dom.gateFloatingText.textContent = `ABRIENDO PUERTA AL NIVEL ${nextLvlNum}...`;
    dom.dungeonGate.classList.remove("hidden");
    dom.gateDoors.classList.remove("open");
    sfx.playDungeonGate();

    setTimeout(() => {
        dom.gateDoors.classList.add("open");
    }, 180);

    setTimeout(() => {
        gameState.currentLevelIndex += 1;
        gameState.statusText = `Jugando Nivel ${gameState.currentLevelIndex + 1}`;
        sqlDB.updatePlayerProgress(gameState);
        loadCurrentLevel();
    }, 950);

    setTimeout(() => {
        dom.dungeonGate.classList.add("hidden");
        dom.gateDoors.classList.remove("open");
    }, 1450);
});

// ============================================================================
// 10. MODALES DE VICTORIA (CON TOTAL DE PUNTOS), DERROTA Y MAPA DE 15 NIVELES
// ============================================================================
function showVictoryModal() {
    stopSpeedBonusTimer();
    sfx.playGrandVictory();
    gameState.statusText = "🏆 Victoria Completa";
    sqlDB.updatePlayerProgress(gameState);

    const maxPossibleScore = 15 * (BASE_LEVEL_POINTS + SPEED_BONUS_POINTS); // 8700 pts
    const bonusPointsTotal = gameState.fastBonusesWon * SPEED_BONUS_POINTS;

    dom.modalMainTitle.textContent = "🏆 ¡JUEGO COMPLETADO CON ÉXITO!";
    dom.modalSubTitle.textContent = `Resumen Oficial de Puntuación — Jugador ID #${gameState.playerId} (${gameState.playerName})`;
    dom.modalDescription.innerHTML = `
        ¡Derrotaste al Golem Guardián de la Vida y superaste los <strong>15 niveles consecutivos</strong>!
        <div class="final-score-showcase">
            <div class="final-score-label">PUNTUACIÓN TOTAL RECABADA</div>
            <div class="final-score-number">🏆 ${gameState.score} PTS</div>
            <div class="final-score-stats-grid">
                <div class="final-stat-chip">🎯 Niveles Vencidos: <strong>15 / 15</strong></div>
                <div class="final-stat-chip">⚡ Bonus Rápidos (&lt;8s): <strong>${gameState.fastBonusesWon} (+${bonusPointsTotal} pts)</strong></div>
                <div class="final-stat-chip">✖ Penalizaciones (-20%): <strong>${gameState.wrongCount} fallos</strong></div>
                <div class="final-stat-chip">❤️ Salud Restante: <strong>${gameState.hp} / ${gameState.maxHp} PV</strong></div>
            </div>
            <div style="margin-top:8px; font-size:0.78rem; color:#94a3b8;">
                Máximo teórico posible: ${maxPossibleScore} pts (500 pts × 15 niveles + 80 pts bonus × 15)
            </div>
        </div>
    `;
    dom.btnStartGame.textContent = "🔄 Jugar de Nuevo desde Nivel 1";
    dom.modalOverlay.classList.remove("hidden");
}

function showGameOverModal() {
    stopSpeedBonusTimer();
    dom.modalMainTitle.textContent = "💀 ¡HAS CAÍDO EN LA MAZMORRA!";
    dom.modalSubTitle.textContent = `Jugador ID #${gameState.playerId} (${gameState.playerName}) — Nivel ${gameState.currentLevelIndex + 1} de 15`;
    dom.modalDescription.innerHTML = `
        Tus puntos de vida llegaron a cero ante los desafíos biológicos.<br>
        <div class="final-score-showcase">
            <div class="final-score-label">PUNTOS RECABADOS HASTA ESTE NIVEL</div>
            <div class="final-score-number">🏆 ${gameState.score} PTS</div>
        </div>
        ¡No te rindas! Tus estadísticas han quedado registradas en la base de datos SQL y puedes reintentar ahora mismo.
    `;
    dom.btnStartGame.textContent = "⚔️ Reintentar la Mazmorra";
    dom.modalOverlay.classList.remove("hidden");
}

function resetAndStartGame() {
    stopSpeedBonusTimer();
    gameState.currentLevelIndex = 0;
    gameState.score = 0;
    gameState.levelAvailablePoints = BASE_LEVEL_POINTS;
    gameState.levelMistakes = 0;
    gameState.fastBonusesWon = 0;
    gameState.hp = 5;
    gameState.maxHp = 5;
    gameState.potions = 1;
    gameState.hasShield = false;
    gameState.hasStone = false;
    gameState.hasWings = false;
    gameState.hasKey = false;
    gameState.statusText = "Jugando Nivel 1";
    sqlDB.updatePlayerProgress(gameState);

    dom.modalOverlay.classList.add("hidden");
    sfx.init();
    sfx.playPotionHeal();
    loadCurrentLevel();
}

dom.btnStartGame.addEventListener("click", resetAndStartGame);

// Mapa interactivo completo de los 15 niveles
dom.btnMap.addEventListener("click", () => {
    dom.fullMapGrid.innerHTML = "";
    DUNGEON_LEVELS.forEach((lvl, idx) => {
        const card = document.createElement("div");
        const status = idx < gameState.currentLevelIndex ? "completed" : (idx === gameState.currentLevelIndex ? "current" : "");
        card.className = `map-room-card ${status}`;
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-weight:700; color:#fbbf24; font-size:0.85rem;">
                <span>Nivel ${lvl.level}</span>
                <span>${idx < gameState.currentLevelIndex ? "✅ Superado" : (idx === gameState.currentLevelIndex ? "⚔️ Actual" : "🔒 Pendiente")}</span>
            </div>
            <div style="font-size:0.8rem; color:#38bdf8; font-weight:600;">${lvl.questionTitle}</div>
            <div style="font-size:0.75rem; color:#94a3b8;">${lvl.actTitle}</div>
        `;
        dom.fullMapGrid.appendChild(card);
    });
    dom.modalMap.classList.remove("hidden");
});

dom.btnCloseMap.addEventListener("click", () => {
    dom.modalMap.classList.add("hidden");
});

dom.btnAudio.addEventListener("click", () => {
    sfx.enabled = !sfx.enabled;
    dom.btnAudio.textContent = sfx.enabled ? "🔊" : "🔇";
});

// ============================================================================
// 11. SISTEMA DE PARTÍCULAS AMBIENTALES EN CANVAS (Magia y Esporas)
// ============================================================================
function initParticles() {
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 45 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 0.8,
        dx: (Math.random() - 0.5) * 0.4,
        dy: -Math.random() * 0.55 - 0.15,
        alpha: Math.random() * 0.65 + 0.2,
        color: Math.random() > 0.5 ? "#38bdf8" : "#fbbf24"
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            if (p.y < 0) p.y = height;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// Inicializar Base de Datos SQL, Pantalla de Carga y Juego al abrir
window.addEventListener("DOMContentLoaded", async () => {
    initParticles();
    await sqlDB.init();
    runBootLoadingSequence();
    loadCurrentLevel();
});
