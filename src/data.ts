export type Item = { kind: string; title: string; body: string; proof?: string[] };
export type Chapter = { id: string; title: string; items: Item[] };

export const COURSE: Chapter[] = [
  {
    id: "1.1", title: "Définitions et exemples", items: [
      { kind: "Définition 1.1.1", title: "Topologie", body: "Soit E non vide. Une topologie τ sur E est une famille de parties de E telle que :\n i) ∅ ∈ τ, E ∈ τ\n ii) l'intersection de deux éléments de τ est dans τ\n iii) toute réunion (finie ou infinie) d'éléments de τ est dans τ.\nLes éléments de τ sont les ouverts ; (E,τ) est un espace topologique." },
      { kind: "Exemples 1.1.2", title: "Topologies classiques", body: "• Discrète : τd = P(E).\n• Grossière : τg = {∅, E}.\n• E={a,b} : τ1={∅,{a},E}, τ2={∅,{b},E}.\n• Usuelle τu sur ℝ : ∅, ℝ et réunions quelconques d'intervalles ]a,b[." },
      { kind: "Définition 1.1.5", title: "Fermé", body: "Une partie F de E est fermée si son complémentaire Fᶜ est un ouvert." },
      { kind: "Remarques 1.1.7", title: "Stabilité", body: "• Ouverts : stables par réunion quelconque et intersection finie.\n• Fermés : stables par intersection quelconque et réunion finie.\n• ⋂ ]−1/n, 1/n[ = {0} : n'est pas ouvert.\n• ⋃ [1/n, 1] = ]0,1] : n'est pas fermé.\n• ]a,b] n'est ni ouvert ni fermé dans (ℝ,τu)." },
      { kind: "Définition 1.1.8", title: "Voisinage", body: "U est un voisinage de x s'il existe un ouvert W tel que x ∈ W ⊂ U. On note 𝒱ₓ l'ensemble des voisinages de x." },
      { kind: "Théorème 1.1.11", title: "Ouvert ⇔ voisinage de tous ses points", body: "A est ouvert si et seulement si A est un voisinage de chacun de ses points.", proof: [
        "(⇒) Évident : si A est ouvert, x ∈ A ⊂ A avec A ouvert.",
        "(⇐) Supposons A voisinage de tous ses points. Soit x ∈ A.",
        "Il existe un ouvert Oₓ tel que x ∈ Oₓ ⊂ A.",
        "Donc ⋃ₓ∈A Oₓ ⊂ A.",
        "Or A ⊂ ⋃ₓ∈A Oₓ, car chaque x ∈ Oₓ.",
        "Donc A = ⋃ₓ∈A Oₓ, réunion d'ouverts : A est ouvert. ∎"] },
      { kind: "Définition 1.1.12", title: "Bases", body: "• ℬ ⊂ τ est une base d'ouverts si tout ouvert est réunion d'éléments de ℬ.\n• ℬₓ ⊂ 𝒱ₓ est une base de voisinages de x si ∀V ∈ 𝒱ₓ, ∃b ∈ ℬₓ, x ∈ b ⊂ V.\nEx : (]x−1/n, x+1/n[)ₙ est une base de voisinages de x dans ℝ." },
      { kind: "Propriété 1.1.14", title: "Caractérisation d'une base", body: "ℬ est une base d'ouverts ⇔ pour tout x, ℬₓ = {b ∈ ℬ : x ∈ b} est une base de voisinages de x.", proof: [
        "(⇒) Soit V ∈ 𝒱ₓ : ∃W ∈ τ, x ∈ W ⊂ V.",
        "W = ⋃ bᵢ avec bᵢ ∈ ℬ, donc ∃i₀ : x ∈ bᵢ₀ ⊂ W ⊂ V.",
        "(⇐) Soit O ouvert, x ∈ O : O est voisinage de x, donc ∃bₓ ∈ ℬ, x ∈ bₓ ⊂ O.",
        "Ainsi ⋃ bₓ ⊂ O ⊂ ⋃ bₓ, d'où O = ⋃ₓ∈O bₓ. ∎"] },
      { kind: "Définition 1.1.15", title: "Espace séparé (Hausdorff)", body: "Pour tous x ≠ x′, il existe W ∈ 𝒱ₓ, W′ ∈ 𝒱ₓ′ avec W ∩ W′ = ∅.\nGrossier : non séparé. Discret et (ℝ,τu) : séparés." },
      { kind: "Proposition 1.1.18", title: "Singletons fermés", body: "Dans un espace séparé, les singletons sont fermés.", proof: [
        "Soit x ∈ E ; montrons que {x}ᶜ est ouvert.",
        "Soit x′ ∈ {x}ᶜ, donc x ≠ x′.",
        "Par séparation : ∃ W, W′ ouverts disjoints, x ∈ W, x′ ∈ W′.",
        "Donc x ∉ W′, d'où W′ ⊂ {x}ᶜ.",
        "{x}ᶜ est voisinage de chacun de ses points, donc ouvert.",
        "Ainsi {x} est fermé. ∎"] },
    ]
  },
  {
    id: "1.2", title: "Intérieur, adhérence, frontière", items: [
      { kind: "Définition 1.2.1", title: "Points remarquables", body: "• a intérieur à A : A ∈ 𝒱ₐ. Intérieur Å.\n• a adhérent à A : ∀V ∈ 𝒱ₐ, V ∩ A ≠ ∅. Adhérence Ā.\n• a point d'accumulation : ∀V ∈ 𝒱ₐ, V ∩ (A∖{a}) ≠ ∅.\n• a point isolé : ∃V ∈ 𝒱ₐ, V ∩ A = {a}.\n• Frontière : ∂A = Ā ∖ Å." },
      { kind: "Exemples 1.2.2", title: "Calculs", body: "• E={a,b}, τ1={∅,{a},E}, A={b} : Å=∅, Ā={b}, ∂A={b}, b isolé.\n• Discret : Å = Ā = A, ∂A = ∅.\n• ℝ, A=]a,b] : Å=]a,b[, Ā=[a,b], accumulation = [a,b], aucun point isolé." },
      { kind: "Propriétés 1.2.3", title: "Å et Ā", body: "• Å ⊂ A ⊂ Ā.\n• Å est le plus grand ouvert contenu dans A : Å = ⋃_{O⊂A} O.\n• (Ā)ᶜ = (Aᶜ)° et Ā est fermé.\n• Ā est le plus petit fermé contenant A : Ā = ⋂_{A⊂F} F.", proof: [
        "Å est ouvert : soit a ∈ Å, ∃W ouvert, a ∈ W ⊂ A.",
        "Pour x ∈ W, A est voisinage de x, donc x ∈ Å : W ⊂ Å.",
        "Donc Å est voisinage de chacun de ses points : ouvert.",
        "Si U ouvert ⊂ A, tout x ∈ U a A pour voisinage, donc U ⊂ Å.",
        "x ∈ (Ā)ᶜ ⇔ ∃V ∈ 𝒱ₓ, V ∩ A = ∅ ⇔ ∃V ⊂ Aᶜ ⇔ x ∈ (Aᶜ)°.",
        "Si F fermé ⊃ A : Fᶜ ouvert ⊂ Aᶜ, donc Fᶜ ⊂ (Aᶜ)° = (Ā)ᶜ, d'où Ā ⊂ F. ∎"] },
      { kind: "Propriété 1.2.4", title: "Relations", body: "• ∂A = Ā ∩ (Aᶜ)‾\n• A ⊂ B ⇒ Å ⊂ B̊ et Ā ⊂ B̄\n• Å = E ∖ (Aᶜ)‾ , Ā = E ∖ (Aᶜ)°", proof: [
        "Par définition, ∂A = Ā ∖ Å = Ā ∩ (Å)ᶜ.",
        "Par la relation entre intérieur et adhérence, (Å)ᶜ = (Aᶜ)‾.",
        "Donc ∂A = Ā ∩ (Aᶜ)‾. ∎"] },
      { kind: "Propriétés 1.2.5–6", title: "Caractérisations", body: "• U ouvert ⇔ Ů = U ;  F fermé ⇔ F̄ = F.\n• (A∪B)‾ = Ā ∪ B̄ ;  (A∩B)° = Å ∩ B̊\n• (A∩B)‾ ⊂ Ā ∩ B̄ ;  Å ∪ B̊ ⊂ (A∪B)°" },
    ]
  },
  {
    id: "1.3", title: "Induite, quotient, produit", items: [
      { kind: "Proposition 1.3.1", title: "Topologie induite", body: "τ_A = {O ∩ A : O ∈ τ} est une topologie sur A.", proof: [
        "∅ = A ∩ ∅ et A = A ∩ E, donc ∅, A ∈ τ_A.",
        "U = O₁∩A, V = O₂∩A ⇒ U∩V = (O₁∩O₂)∩A ∈ τ_A.",
        "uᵢ = Oᵢ∩A ⇒ ⋃uᵢ = (⋃Oᵢ)∩A ∈ τ_A. ∎"] },
      { kind: "Définition 1.3.2", title: "Sous-espace topologique", body: "La topologie τ_A = {O ∩ A : O ∈ τ} est la topologie induite sur A. Le couple (A,τ_A) est un sous-espace topologique de (E,τ)." },
      { kind: "Exemple 1.3.4", title: "Ouvert relatif", body: "Dans A = [−1,1], w = ]0,1] = A ∩ ]0,+∞[ est ouvert dans (A,τ_A), mais ni ouvert ni fermé dans ℝ." },
      { kind: "Proposition 1.3.5", title: "Voisinages induits", body: "V est voisinage de a dans (A,τ_A) ⇔ V = W ∩ A avec W voisinage de a dans E.", proof: [
        "Si W est un voisinage de a dans E, il existe O ouvert de E tel que a ∈ O ⊂ W.",
        "Alors a ∈ O ∩ A ⊂ W ∩ A, et O ∩ A est ouvert dans A : W ∩ A est un voisinage de a dans A.",
        "Réciproquement, si V est un voisinage de a dans A, il existe O ouvert de E tel que a ∈ O ∩ A ⊂ V.",
        "Posons W = O ∪ V. C'est un voisinage de a dans E et W ∩ A = (O ∩ A) ∪ V = V. ∎"] },
      { kind: "Définition 1.3.7", title: "Topologie quotient", body: "q : E → E/ℛ, x ↦ [x]. τ̃ = {U ⊂ E/ℛ : q⁻¹(U) ∈ τ} est la topologie quotient." },
      { kind: "Définition 1.3.9", title: "Topologie produit", body: "Sur E = E₁×…×Eₙ, τπ = réunions quelconques de pavés u₁×…×uₙ avec uᵢ ∈ τᵢ." },
    ]
  },
  {
    id: "1.4", title: "Applications continues", items: [
      { kind: "Définition 1.4.1", title: "Limite", body: "f tend vers b quand x → a si ∀V ∈ 𝒱_b, ∃U ∈ 𝒱ₐ, f(U) ⊂ V.\nSi F est grossier, tout b est limite : unicité non garantie." },
      { kind: "Théorème 1.4.4", title: "Unicité de la limite", body: "Si F est séparé, la limite (si elle existe) est unique.", proof: [
        "Supposons deux limites b ≠ b′ en a.",
        "F séparé : ∃V ∈ 𝒱_b, V′ ∈ 𝒱_b′ avec V ∩ V′ = ∅.",
        "∃U ∈ 𝒱ₐ, f(U) ⊂ V et ∃U′ ∈ 𝒱ₐ, f(U′) ⊂ V′.",
        "f(U∩U′) ⊂ V ∩ V′ = ∅.",
        "Or a ∈ U∩U′, donc f(a) ∈ f(U∩U′) ≠ ∅ : absurde. ∎"] },
      { kind: "Définition 1.4.5", title: "Continuité", body: "Une application f : E → F est continue en a si elle tend vers f(a) quand x tend vers a. Elle est continue sur E si elle est continue en chacun de ses points." },
      { kind: "Théorème 1.4.6", title: "Caractérisations de la continuité", body: "Équivalent :\n a) f continue\n b) ∀U ouvert de F, f⁻¹(U) ouvert\n c) ∀V fermé de F, f⁻¹(V) fermé\n d) ∀A ⊂ E, f(Ā) ⊂ (f(A))‾", proof: [
        "(a⇒d) a ∈ Ā, W ∈ 𝒱_f(a) : ∃U ∈ 𝒱ₐ, f(U) ⊂ W ; U∩A ≠ ∅ donc W ∩ f(A) ≠ ∅.",
        "(d⇒c) W = f⁻¹(V) : f(W̄) ⊂ (f(W))‾ ⊂ V̄ = V, donc W̄ ⊂ W : W fermé.",
        "(c⇒b) f⁻¹(Uᶜ) = E ∖ f⁻¹(U) fermé, donc f⁻¹(U) ouvert.",
        "(b⇒a) V ∈ 𝒱_f(x₀), W ouvert, f(x₀) ∈ W ⊂ V ; U = f⁻¹(W) ouvert contient x₀ et f(U) ⊂ V. ∎"] },
      { kind: "Corollaire 1.4.7", title: "Composition", body: "(g∘f)⁻¹(V) = f⁻¹(g⁻¹(V)) : la composée de continues est continue.", proof: [
        "Soit V un ouvert de H. On a (g∘f)⁻¹(V) = f⁻¹(g⁻¹(V)).",
        "Comme g est continue, g⁻¹(V) est ouvert dans F. Comme f est continue, f⁻¹(g⁻¹(V)) est ouvert dans E.",
        "L'image réciproque de tout ouvert de H est ouverte dans E : g∘f est continue. ∎"] },
      { kind: "Définition 1.4.8", title: "Homéomorphisme", body: "f bijective, f et f⁻¹ continues. Id : (E,τ) → (E,τ′) est un homéomorphisme ⇔ τ = τ′." },
    ]
  },
];

export type Q = { q: string; choices: string[]; a: number; why: string };
export const QUIZ: Q[] = [
  { q: "Quelle famille est une topologie sur E={a,b} ?", choices: ["{∅,{a},{b}}", "{∅,{a},E}", "{{a},E}", "{∅,{a}}"], a: 1, why: "Il faut ∅ et E, et la stabilité : {∅,{a},E} = τ1." },
  { q: "Dans (ℝ,τu), ⋂ ]−1/n,1/n[ vaut :", choices: ["∅", "]−1,1[", "{0}", "ℝ"], a: 2, why: "L'intersection infinie d'ouverts donne {0}, qui est fermé, pas ouvert." },
  { q: "Une topologie est discrète si et seulement si…", choices: ["E est fini", "tout singleton est ouvert", "elle est séparée", "∅ est fermé"], a: 1, why: "Exercice 1.1.4 : toute partie est réunion de singletons." },
  { q: "]a,b] dans (ℝ,τu) est :", choices: ["ouvert", "fermé", "ouvert et fermé", "ni ouvert ni fermé"], a: 3, why: "Remarque 1.1.7 (b)." },
  { q: "Å est :", choices: ["le plus petit fermé contenant A", "le plus grand ouvert contenu dans A", "Ā ∖ A", "A ∪ ∂A"], a: 1, why: "Propriété 1.2.3 (3)." },
  { q: "La frontière ∂A est égale à :", choices: ["Ā ∩ (Aᶜ)‾", "Å ∪ Ā", "A ∖ Å", "Ā ∩ Å"], a: 0, why: "Propriété 1.2.4 (1)." },
  { q: "L'espace grossier (avec |E|≥2) est-il séparé ?", choices: ["Oui", "Non", "Seulement si E fini", "Seulement si E = ℝ"], a: 1, why: "Le seul voisinage de chaque point est E." },
  { q: "Dans un espace séparé, les singletons sont :", choices: ["ouverts", "fermés", "denses", "vides"], a: 1, why: "Proposition 1.1.18." },
  { q: "f est continue ⇔", choices: ["f(ouvert) est ouvert", "f⁻¹(ouvert) est ouvert", "f est bijective", "f(Ā) ⊃ (f(A))‾"], a: 1, why: "Théorème 1.4.6 (b)." },
  { q: "Dans A=[−1,1] (induite), ]0,1] est :", choices: ["ouvert dans A", "fermé dans A uniquement", "ni l'un ni l'autre", "non défini"], a: 0, why: "]0,1] = A ∩ ]0,+∞[." },
  { q: "La limite est unique dès que l'espace d'arrivée est :", choices: ["discret", "séparé", "grossier", "fini"], a: 1, why: "Théorème 1.4.4." },
  { q: "(A∪B)‾ est égal à :", choices: ["Ā ∩ B̄", "Ā ∪ B̄", "Å ∪ B̊", "⊂ Ā ∪ B̄ strictement"], a: 1, why: "Propriété 1.2.6 (1)." },
];

export const TF: { s: string; v: boolean; why: string }[] = [
  { s: "Une réunion infinie de fermés est toujours fermée.", v: false, why: "⋃[1/n,1] = ]0,1]." },
  { s: "∅ et E sont à la fois ouverts et fermés.", v: true, why: "Remarque 1.1.7 (4)." },
  { s: "Si A n'est pas ouvert, alors A est fermé.", v: false, why: "]a,b] n'est ni l'un ni l'autre." },
  { s: "La famille {∅, ℝ, ]a,b[} est une topologie sur ℝ.", v: false, why: "]0,1[ ∪ ]2,3[ n'est pas un intervalle (Exercice 1.1.3)." },
  { s: "∅ est un voisinage de x.", v: false, why: "∅ ∉ 𝒱ₓ." },
  { s: "Une réunion quelconque de voisinages de x est un voisinage de x.", v: true, why: "Propriété 1.1.10 (6)." },
  { s: "Les intervalles ouverts forment une base de τu.", v: true, why: "Exemple 1.1.13 (2)." },
  { s: "Les ]−∞,a[ et ]a,+∞[ forment une base de τu.", v: false, why: "Exemple 1.1.13 (3) : ]0,1[ n'est pas une réunion de tels intervalles." },
  { s: "Ā est le plus petit fermé contenant A.", v: true, why: "Propriété 1.2.3 (6)." },
  { s: "Å ∪ B̊ = (A∪B)° toujours.", v: false, why: "Seulement l'inclusion ⊂ (ex : ℚ et ℝ∖ℚ)." },
  { s: "La composée de deux applications continues est continue.", v: true, why: "Corollaire 1.4.7." },
  { s: "Dans un espace discret, ∂A = ∅ pour tout A.", v: true, why: "Å = Ā = A." },
];
