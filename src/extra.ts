import { QUIZ as Q0, TF as T0, type Q } from "./data";

export const QUIZ: Q[] = [
  ...Q0,
  { q: "Combien de topologies distinctes existe-t-il sur un ensemble à 3 éléments ?", choices: ["8", "19", "29", "64"], a: 2, why: "Il y en a exactement 29 (9 à homéomorphisme près)." },
  { q: "Combien de topologies sur E = {a,b} ?", choices: ["2", "3", "4", "5"], a: 2, why: "τg, τd, {∅,{a},E}, {∅,{b},E}." },
  { q: "Dans (ℝ,τu), ℚ̄ est égal à :", choices: ["ℚ", "∅", "ℝ", "ℝ∖ℚ"], a: 2, why: "ℚ est dense : tout intervalle ouvert contient un rationnel." },
  { q: "Dans (ℝ,τu), l'intérieur de ℚ est :", choices: ["ℚ", "∅", "ℝ", "ℤ"], a: 1, why: "Tout intervalle ouvert contient un irrationnel." },
  { q: "∂ℚ dans ℝ vaut :", choices: ["∅", "ℚ", "ℝ", "ℝ∖ℚ"], a: 2, why: "∂ℚ = ℚ̄ ∖ ℚ° = ℝ ∖ ∅ = ℝ." },
  { q: "Si f : (E,τd) → (F,τ′) avec τd discrète, alors f est :", choices: ["jamais continue", "toujours continue", "continue ssi bijective", "continue ssi F séparé"], a: 1, why: "Toute image réciproque est une partie de E, donc ouverte." },
  { q: "Si f : (E,τ) → (F,τg) avec τg grossière, alors f est :", choices: ["toujours continue", "jamais continue", "continue ssi constante", "continue ssi surjective"], a: 0, why: "f⁻¹(∅) = ∅ et f⁻¹(F) = E sont ouverts." },
  { q: "Les points d'accumulation de A = {1/n : n ≥ 1} dans ℝ :", choices: ["∅", "{0}", "A", "A ∪ {0}"], a: 1, why: "Seul 0 est limite de points distincts de A." },
  { q: "Les points isolés de ℤ dans (ℝ,τu) :", choices: ["aucun", "tous", "seulement 0", "les entiers pairs"], a: 1, why: "]n−½, n+½[ ∩ ℤ = {n}." },
  { q: "Dans la topologie induite sur ℤ par ℝ, {0} est :", choices: ["ouvert seulement", "fermé seulement", "ouvert et fermé", "ni l'un ni l'autre"], a: 2, why: "La topologie induite sur ℤ est discrète." },
  { q: "Une base de voisinages de x dans ℝ :", choices: ["{]x−n, x+n[}", "{]x−1/n, x+1/n[}", "{[x, x+1/n[}", "{{x}}"], a: 1, why: "Exemple 1.1.13 (4)." },
  { q: "(Ā)ᶜ est égal à :", choices: ["Ā", "(Aᶜ)°", "Å", "(Aᶜ)‾"], a: 1, why: "Propriété 1.2.3 (5)." },
  { q: "Si A ⊂ B, alors :", choices: ["Ā ⊃ B̄", "Å ⊂ B̊", "∂A ⊂ ∂B", "Å = B̊"], a: 1, why: "Propriété 1.2.4 (2). Attention : ∂ n'est pas croissante." },
  { q: "Un homéomorphisme est :", choices: ["bijection continue", "bijection bicontinue", "surjection ouverte", "injection fermée"], a: 1, why: "f bijective, f et f⁻¹ continues." },
  { q: "x ↦ x de (ℝ,τd) vers (ℝ,τu) est :", choices: ["continue non homéo", "homéomorphisme", "non continue", "constante"], a: 0, why: "Continue (départ discret) mais l'inverse ne l'est pas, car τd ≠ τu." },
  { q: "Dans un espace fini séparé, la topologie est :", choices: ["grossière", "discrète", "à 3 ouverts", "quelconque"], a: 1, why: "Les singletons sont fermés, donc tout ensemble (réunion finie) est fermé, donc ouvert." },
];

export const TF = [
  ...T0,
  { s: "Dans ℝ, ℚ est dense.", v: true, why: "ℚ̄ = ℝ." },
  { s: "Tout espace discret est séparé.", v: true, why: "Prendre W = {x}, W′ = {x′}." },
  { s: "Si {x} est fermé pour tout x, l'espace est séparé.", v: false, why: "Topologie cofinie sur ℝ : T1 mais non séparée." },
  { s: "L'adhérence d'un ouvert est toujours ouverte.", v: false, why: "Dans ℝ, ]0,1[‾ = [0,1] n'est pas ouvert." },
  { s: "Å est toujours un ouvert.", v: true, why: "Propriété 1.2.3 (2)." },
  { s: "∂A est toujours fermé.", v: true, why: "∂A = Ā ∩ (Aᶜ)‾, intersection de deux fermés." },
  { s: "Une application continue envoie les ouverts sur des ouverts.", v: false, why: "Ce sont les images réciproques ! x ↦ 0 envoie ℝ sur {0}." },
  { s: "τ_A ⊂ τ dès que A est ouvert dans E.", v: true, why: "O ∩ A est alors intersection de deux ouverts de E." },
  { s: "f(Ā) ⊂ (f(A))‾ pour toute f continue.", v: true, why: "Théorème 1.4.6 (d)." },
  { s: "Un point isolé de A est un point d'accumulation de A.", v: false, why: "C'est exactement le contraire : un point de A est soit isolé, soit d'accumulation." },
  { s: "Ā = A ∪ {points d'accumulation de A}.", v: true, why: "Tout point adhérent est soit dans A, soit d'accumulation." },
  { s: "La topologie grossière est plus fine que la discrète.", v: false, why: "C'est la moins fine : τg ⊂ τ ⊂ τd." },
];

export type Exo = { id: string; title: string; level: 1 | 2 | 3; statement: string; hint: string; solution: string[] };
export const EXERCISES: Exo[] = [
  { id: "1.1.3", title: "Intervalles et topologie", level: 1, statement: "Montrer que la famille formée de ∅, ℝ et des intervalles ]a,b[ n'est pas une topologie sur ℝ.", hint: "Teste l'axiome de réunion avec deux intervalles disjoints.", solution: ["Considérons ]0,1[ et ]2,3[, éléments de la famille.", "Leur réunion ]0,1[ ∪ ]2,3[ n'est ni ∅, ni ℝ, ni un intervalle (non connexe : 1,5 ∉ mais 0,5 et 2,5 ∈).", "L'axiome iii) est donc violé : ce n'est pas une topologie. ∎"] },
  { id: "1.1.4", title: "Caractérisation de la discrète", level: 1, statement: "Montrer qu'une topologie τ sur E est discrète si et seulement si tout singleton est ouvert.", hint: "Toute partie est la réunion de ses singletons.", solution: ["(⇒) Si τ = P(E), chaque {x} ∈ τ.", "(⇐) Soit A ⊂ E. A = ⋃_{x∈A} {x}, réunion d'ouverts.", "Par l'axiome iii), A ∈ τ. Donc τ = P(E). ∎"] },
  { id: "E1", title: "Topologies sur {a,b,c}", level: 2, statement: "Parmi τ₁ = {∅,{a},{b},E} et τ₂ = {∅,{a},{a,b},E}, lesquelles sont des topologies sur E = {a,b,c} ?", hint: "Vérifie que {a} ∪ {b} appartient à τ₁.", solution: ["τ₁ : {a} ∪ {b} = {a,b} ∉ τ₁ → ce n'est pas une topologie.", "τ₂ : ∅, E ∈ τ₂ ; {a} ∩ {a,b} = {a} ∈ τ₂ ; {a} ∪ {a,b} = {a,b} ∈ τ₂.", "τ₂ est une topologie (chaîne emboîtée). ∎"] },
  { id: "E2", title: "Intérieur et adhérence finis", level: 2, statement: "E = {a,b,c}, τ = {∅,{a},{a,b},E}. Calculer Å, Ā, ∂A pour A = {b}, puis pour A = {a,c}.", hint: "Les fermés sont E, {b,c}, {c}, ∅.", solution: ["Fermés : E, {b,c}, {c}, ∅.", "A = {b} : aucun ouvert non vide ⊂ {b}, donc Å = ∅. Plus petit fermé ⊃ {b} : {b,c}. ∂A = {b,c}.", "A = {a,c} : le plus grand ouvert inclus est {a}, donc Å = {a}. Seul fermé ⊃ {a,c} : E, donc Ā = E. ∂A = {b,c}. ∎"] },
  { id: "E3", title: "ℚ dans ℝ", level: 2, statement: "Dans (ℝ,τu), déterminer ℚ°, ℚ̄ et ∂ℚ.", hint: "Densité de ℚ et de ℝ∖ℚ.", solution: ["Tout ]a,b[ contient un irrationnel, donc aucun intervalle ouvert n'est inclus dans ℚ : ℚ° = ∅.", "Tout ]a,b[ contient un rationnel, donc tout x est adhérent : ℚ̄ = ℝ.", "∂ℚ = ℚ̄ ∖ ℚ° = ℝ. ∎"] },
  { id: "E4", title: "Adhérence d'une réunion", level: 2, statement: "Montrer que (A∪B)‾ = Ā ∪ B̄.", hint: "Utilise que Ā est le plus petit fermé contenant A.", solution: ["A ⊂ A∪B ⇒ Ā ⊂ (A∪B)‾ ; de même B̄ ⊂ (A∪B)‾. Donc Ā ∪ B̄ ⊂ (A∪B)‾.", "Ā ∪ B̄ est un fermé (réunion finie de fermés) qui contient A ∪ B.", "Par minimalité, (A∪B)‾ ⊂ Ā ∪ B̄. ∎"] },
  { id: "E5", title: "Contre-exemple : intersection", level: 2, statement: "Trouver A, B ⊂ ℝ tels que (A∩B)‾ ≠ Ā ∩ B̄.", hint: "Pense à ℚ et à son complémentaire.", solution: ["A = ℚ, B = ℝ∖ℚ.", "A ∩ B = ∅ donc (A∩B)‾ = ∅.", "Ā = B̄ = ℝ donc Ā ∩ B̄ = ℝ ≠ ∅. ∎"] },
  { id: "E6", title: "Intérieur d'une réunion", level: 2, statement: "Trouver A, B ⊂ ℝ tels que Å ∪ B̊ ≠ (A∪B)°.", hint: "Découpe un intervalle en un point.", solution: ["A = [0,1], B = [1,2].", "Å ∪ B̊ = ]0,1[ ∪ ]1,2[, qui ne contient pas 1.", "(A∪B)° = ]0,2[ ∋ 1. Les deux ensembles diffèrent. ∎"] },
  { id: "1.4.9", title: "L'identité homéomorphisme", level: 3, statement: "Montrer que Id : (E,τ) → (E,τ′) est un homéomorphisme ⇔ τ = τ′.", hint: "Id continue ⇔ τ′ ⊂ τ.", solution: ["Id continue ⇔ ∀U ∈ τ′, Id⁻¹(U) = U ∈ τ ⇔ τ′ ⊂ τ.", "Id⁻¹ = Id : (E,τ′) → (E,τ) continue ⇔ τ ⊂ τ′.", "Id est bijective, donc homéo ⇔ τ′ ⊂ τ et τ ⊂ τ′ ⇔ τ = τ′. ∎"] },
  { id: "E7", title: "Séparation et finitude", level: 3, statement: "Montrer qu'un espace fini séparé est discret.", hint: "Proposition 1.1.18 + réunion finie de fermés.", solution: ["Séparé ⇒ tout singleton {x} est fermé (Prop 1.1.18).", "Soit A ⊂ E : Aᶜ est fini, donc réunion finie de singletons, donc fermé.", "Ainsi A est ouvert pour tout A : τ = P(E). ∎"] },
  { id: "E8", title: "Ouverts induits", level: 2, statement: "Soit A ouvert dans (E,τ). Montrer que tout ouvert de (A,τ_A) est un ouvert de E.", hint: "U = O ∩ A avec O ouvert.", solution: ["Soit U ∈ τ_A : il existe O ∈ τ avec U = O ∩ A.", "O et A sont ouverts dans E, et τ est stable par intersection finie.", "Donc U ∈ τ. ∎"] },
  { id: "E9", title: "Fonction caractéristique", level: 3, statement: "Soit A ⊂ E et 𝟙_A : E → ℝ. Montrer que 𝟙_A est continue ⇔ A est ouvert et fermé.", hint: "Calcule les images réciproques des ouverts de ℝ.", solution: ["Pour U ouvert de ℝ, 𝟙_A⁻¹(U) ∈ {∅, A, Aᶜ, E}, selon que 0, 1 sont dans U.", "Les cas U = ]½, 2[ et U = ]−½, ½[ donnent A et Aᶜ.", "Donc 𝟙_A continue ⇔ A et Aᶜ ouverts ⇔ A ouvert et fermé. ∎"] },
];

export type Flash = { id: string; front: string; back: string; tag: string };
export const FLASHCARDS: Flash[] = [
  { id: "f1", tag: "Déf", front: "Topologie sur E", back: "Famille τ ⊂ P(E) : ∅, E ∈ τ ; stable par ∩ finie ; stable par ∪ quelconque." },
  { id: "f2", tag: "Déf", front: "Fermé", back: "Partie dont le complémentaire est ouvert." },
  { id: "f3", tag: "Déf", front: "Voisinage de x", back: "U ⊃ W avec W ouvert et x ∈ W." },
  { id: "f4", tag: "Thm", front: "Caractérisation des ouverts", back: "A ouvert ⇔ A est voisinage de chacun de ses points." },
  { id: "f5", tag: "Déf", front: "Base d'ouverts ℬ", back: "Tout ouvert est réunion d'éléments de ℬ." },
  { id: "f6", tag: "Déf", front: "Base de voisinages ℬₓ", back: "∀V ∈ 𝒱ₓ, ∃b ∈ ℬₓ : x ∈ b ⊂ V." },
  { id: "f7", tag: "Déf", front: "Espace séparé", back: "x ≠ x′ ⇒ ∃W ∈ 𝒱ₓ, W′ ∈ 𝒱ₓ′, W ∩ W′ = ∅." },
  { id: "f8", tag: "Prop", front: "Séparé ⇒ ?", back: "Les singletons sont fermés." },
  { id: "f9", tag: "Déf", front: "Intérieur Å", back: "Points dont A est un voisinage. C'est le plus grand ouvert ⊂ A." },
  { id: "f10", tag: "Déf", front: "Adhérence Ā", back: "Points dont tout voisinage rencontre A. C'est le plus petit fermé ⊃ A." },
  { id: "f11", tag: "Déf", front: "Point d'accumulation", back: "∀V ∈ 𝒱ₐ, V ∩ (A ∖ {a}) ≠ ∅." },
  { id: "f12", tag: "Déf", front: "Point isolé", back: "∃V ∈ 𝒱ₐ, V ∩ A = {a}." },
  { id: "f13", tag: "Déf", front: "Frontière ∂A", back: "Ā ∖ Å = Ā ∩ (Aᶜ)‾." },
  { id: "f14", tag: "Prop", front: "(Ā)ᶜ = ?", back: "(Aᶜ)°" },
  { id: "f15", tag: "Prop", front: "(A∪B)‾", back: "= Ā ∪ B̄" },
  { id: "f16", tag: "Prop", front: "(A∩B)°", back: "= Å ∩ B̊" },
  { id: "f17", tag: "Déf", front: "Topologie induite τ_A", back: "{O ∩ A : O ∈ τ}" },
  { id: "f18", tag: "Déf", front: "Topologie quotient", back: "U ouvert ⇔ q⁻¹(U) ∈ τ, avec q la surjection canonique." },
  { id: "f19", tag: "Déf", front: "Topologie produit", back: "Réunions quelconques de pavés u₁×…×uₙ avec uᵢ ∈ τᵢ." },
  { id: "f20", tag: "Déf", front: "Limite de f en a", back: "∀V ∈ 𝒱_b, ∃U ∈ 𝒱ₐ, f(U) ⊂ V." },
  { id: "f21", tag: "Thm", front: "Unicité de la limite", back: "Vraie si l'espace d'arrivée est séparé." },
  { id: "f22", tag: "Thm", front: "f continue ⇔ (ouverts)", back: "Pour tout ouvert U de F, f⁻¹(U) est ouvert." },
  { id: "f23", tag: "Thm", front: "f continue ⇔ (adhérence)", back: "∀A ⊂ E, f(Ā) ⊂ (f(A))‾" },
  { id: "f24", tag: "Déf", front: "Homéomorphisme", back: "Bijection continue d'inverse continue." },
  { id: "f25", tag: "Ex", front: "⋂ ]−1/n, 1/n[", back: "= {0} : une intersection infinie d'ouverts n'est pas forcément ouverte." },
  { id: "f26", tag: "Ex", front: "⋃ [1/n, 1]", back: "= ]0,1] : une réunion infinie de fermés n'est pas forcément fermée." },
  { id: "f27", tag: "Ex", front: "ℚ°, ℚ̄, ∂ℚ dans ℝ", back: "∅, ℝ, ℝ" },
  { id: "f28", tag: "Prop", front: "Composée de continues", back: "Continue : (g∘f)⁻¹(V) = f⁻¹(g⁻¹(V))." },
];

export const MEMORY_PAIRS: [string, string][] = [
  ["Å", "plus grand ouvert ⊂ A"],
  ["Ā", "plus petit fermé ⊃ A"],
  ["∂A", "Ā ∖ Å"],
  ["τd", "P(E)"],
  ["τg", "{∅, E}"],
  ["τ_A", "{O ∩ A}"],
  ["Séparé", "singletons fermés"],
  ["Continue", "f⁻¹(ouvert) ouvert"],
];

export const GLOSSARY = [
  ["Ouvert", "Élément de la topologie τ."], ["Fermé", "Complémentaire d'un ouvert."], ["Voisinage", "Contient un ouvert contenant le point."],
  ["Base", "Génère tous les ouverts par réunion."], ["Séparé", "Deux points distincts ont des voisinages disjoints."],
  ["Intérieur", "Plus grand ouvert inclus."], ["Adhérence", "Plus petit fermé contenant."], ["Frontière", "Adhérence privée de l'intérieur."],
  ["Dense", "Partie dont l'adhérence est E."], ["Point isolé", "Possède un voisinage ne rencontrant A qu'en lui-même."],
  ["Accumulation", "Tout voisinage rencontre A en un autre point."], ["Induite", "Traces des ouverts sur A."],
  ["Quotient", "Plus fine topologie rendant q continue."], ["Produit", "Engendrée par les pavés d'ouverts."],
  ["Continue", "Images réciproques d'ouverts ouvertes."], ["Homéomorphisme", "Bijection bicontinue."],
];
