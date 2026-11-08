export type SceneKind =
  | "cover"
  | "finite"
  | "complement"
  | "shrinking"
  | "neighborhood"
  | "basis"
  | "separation"
  | "boundary"
  | "subspace"
  | "quotient"
  | "product"
  | "mapping"
  | "composition"
  | "interval-disjoint"
  | "interval-touch"
  | "interval-adjacent"
  | "finite-chain"
  | "dense"
  | "set-union"
  | "characteristic"
  | "torus";

export type SceneFocus = {
  label: string;
  description: string;
  parts: string[];
};

export type SceneConfig = {
  kind: SceneKind;
  title: string;
  formula: string;
  description: string;
  legend: { color: string; label: string }[];
  views: SceneFocus[];
  proof?: SceneFocus[];
  pointLabels?: [string, string];
  regionLabels?: [string, string];
  layout?: "hero";
};

const colors = { violet: "#b39aff", cyan: "#70e4dd", gold: "#f4c877", rose: "#f78ba8" };
const view = (label: string, description: string, ...parts: string[]): SceneFocus => ({ label, description, parts });
const all = view("Vue d'ensemble", "Manipulez le modèle pour observer la notion sous un autre angle.");
const legend = (...entries: [keyof typeof colors, string][]) => entries.map(([color, label]) => ({ color: colors[color], label }));

const COVER_VIEWS = [
  all,
  view("Les points", "On travaille ici dans un espace fini : chaque sphère blanche représente un point.", "point"),
  view("Les ouverts", "Dans cet exemple discret, chaque petit voisinage ne contient qu'un point de l'espace.", "open", "point"),
  view("La réunion", "La réunion des trois petits ouverts contient exactement les points de A.", "region", "open", "point"),
];
const NEIGHBOR_VIEWS = [
  all,
  view("Le point x", "Le point x appartient à l'ouvert W, représenté en turquoise.", "point", "inner"),
  view("W ⊂ V", "Le voisinage V contient un ouvert W qui contient lui-même x.", "inner", "outer", "point"),
];
const BOUNDARY_VIEWS = [
  all,
  view("Intérieur", "L'intérieur est le disque ouvert : aucun point du cercle ni le point isolé p n'en fait partie.", "interior"),
  view("Adhérence", "L'adhérence est le disque fermé, auquel on ajoute le point isolé p.", "closure"),
  view("Frontière", "La frontière comprend le cercle et le point isolé p : ∂A = Ā ∖ A°.", "boundary"),
  view("Accumulation", "Les points d'accumulation sont les points du disque fermé ; p est isolé.", "accumulation"),
  view("Isolé", "Le point p est dans A et un petit voisinage ne rencontre A qu'en p.", "isolated"),
];
const SUBSPACE_VIEWS = [
  all,
  view("Espace A", "Le plan représente le sous-espace A de l'espace ambiant.", "plane"),
  view("Ouvert O", "La boule O est un ouvert de l'espace ambiant.", "sphere"),
  view("O ∩ A", "La coupe turquoise est ouverte dans le sous-espace A.", "intersection"),
];
const MAP_VIEWS = [
  all,
  view("Départ", "La zone turquoise représente un ouvert du domaine.", "source", "points"),
  view("Arrivée", "La zone violette représente un ouvert V de l'espace d'arrivée.", "target", "points"),
  view("Image réciproque", "Dans cet exemple, f est l'identité entre deux copies de ℝ³ : f⁻¹(V) est ouvert.", "source", "target", "arrows", "inverse"),
];

export const SCENE_CONFIG: Record<string, SceneConfig> = {
  "Définition 1.1.1": {
    kind: "cover", title: "Une famille d'ouverts", formula: "∅, E ∈ τ   ·   U ∩ V ∈ τ   ·   ⋃ Uᵢ ∈ τ",
    description: "Un exemple fini : les points de A sont recouverts par de petits ouverts. La topologie est une famille de parties, pas une forme unique.",
    legend: legend(["violet", "partie A"], ["cyan", "ouverts"], ["gold", "points"]), views: COVER_VIEWS,
  },
  "Exemples 1.1.2": {
    kind: "finite", title: "La topologie discrète", formula: "τd = 𝒫(E)",
    description: "Dans cet exemple, chaque singleton est ouvert. Toute partie est une réunion de singletons.",
    legend: legend(["cyan", "singletons ouverts"], ["gold", "points de E"]), views: [all, view("Singletons", "Chaque petite boule représente un singleton ouvert.", "open", "point"), view("Espace E", "Le contour représente l'ensemble E contenant tous les points.", "region", "point")],
  },
  "Définition 1.1.5": {
    kind: "complement", title: "Fermé et complémentaire", formula: "F fermé ⇔ E ∖ F ouvert",
    description: "Exemple dans ℝ² : le disque fermé contient son cercle, tandis que son complémentaire est ouvert.",
    legend: legend(["violet", "fermé F"], ["cyan", "complémentaire"], ["gold", "bord de F"]),
    views: [all, view("F", "Le disque et son bord doré forment le fermé F.", "inside", "border"), view("Fᶜ", "L'extérieur du disque est le complémentaire ouvert de F.", "outside")],
  },
  "Remarques 1.1.7": {
    kind: "shrinking", title: "Intersection infinie", formula: "⋂ B(0, 1/n) = {0}",
    description: "Dans ℝ³, des boules ouvertes se resserrent autour de 0. Leur intersection infinie est un singleton, non ouvert.",
    legend: legend(["violet", "boules ouvertes"], ["gold", "point limite"]),
    views: [all, view("Les boules", "Chaque boule de rayon 1/n est ouverte dans ℝ³.", "open"), view("L'intersection", "Le seul point appartenant à toutes les boules est 0.", "point")],
  },
  "Définition 1.1.8": {
    kind: "neighborhood", title: "Un voisinage de x", formula: "x ∈ W ⊂ V",
    description: "Le voisinage V contient un ouvert W autour de x. V n'a pas besoin d'être lui-même ouvert.",
    legend: legend(["cyan", "ouvert W"], ["violet", "voisinage V"], ["gold", "point x"]), views: NEIGHBOR_VIEWS,
  },
  "Théorème 1.1.11": {
    kind: "cover", title: "Recouvrir par des ouverts", formula: "A = ⋃ₓ∈A Oₓ",
    description: "Dans cet exemple fini, les ouverts autour des points recouvrent A.",
    legend: legend(["violet", "partie A"], ["cyan", "ouverts Oₓ"], ["gold", "points de A"]), views: COVER_VIEWS,
    proof: [
      view("Étape 1", "Si A est ouvert, il est un voisinage de chacun de ses points.", "region", "point"),
      view("Étape 2", "On considère un point quelconque x dans A.", "point-0"),
      view("Étape 3", "Autour de ce point, un ouvert Oₓ est contenu dans A.", "open-0", "point-0", "region"),
      view("Étape 4", "Chaque Oₓ est contenu dans A, donc leur réunion aussi.", "open", "region"),
      view("Étape 5", "Chaque point de A appartient à un des ouverts de la réunion.", "point", "open"),
      view("Étape 6", "Les deux inclusions donnent A = ⋃ Oₓ, donc A est ouvert.", "region", "open", "point"),
    ],
  },
  "Définition 1.1.12": {
    kind: "basis", title: "Une base de voisinages", formula: "x ∈ b ⊂ V",
    description: "Des voisinages de base de plus en plus petits autour de x permettent de trouver un élément contenu dans V.",
    legend: legend(["cyan", "éléments de base"], ["violet", "voisinage V"], ["gold", "point x"]),
    views: [all, view("Voisinage V", "Le grand voisinage contient le point x.", "outer", "point"), view("Éléments de base", "Un élément de base assez petit est contenu dans V.", "inner", "point")],
  },
  "Propriété 1.1.14": {
    kind: "basis", title: "De la base aux voisinages", formula: "x ∈ b ⊂ W ⊂ V",
    description: "Des ouverts de base emboîtés illustrent le passage entre base d'ouverts et base locale.",
    legend: legend(["cyan", "base b"], ["violet", "voisinage V"], ["gold", "point x"]),
    views: [all, view("Voisinage V", "Le grand voisinage V contient x.", "outer", "point"), view("Ouvert de base b", "Un ouvert de base assez petit contient x et reste dans V.", "inner", "point")],
    proof: [
      view("Étape 1", "On part d'un voisinage V et d'un ouvert W contenant x.", "outer", "point"),
      view("Étape 2", "Comme W est réunion d'éléments de base, l'un d'eux contient x.", "inner", "point"),
      view("Étape 3", "Réciproquement, autour de chaque point de O on choisit un ouvert de base.", "inner", "point", "outer"),
      view("Étape 4", "Ces ouverts de base recouvrent O ; O est leur réunion.", "inner", "outer"),
    ],
  },
  "Définition 1.1.15": {
    kind: "separation", title: "Séparer deux points", formula: "x ∈ U, y ∈ V, U ∩ V = ∅",
    description: "Deux points distincts possèdent des voisinages ouverts disjoints dans un espace séparé.",
    legend: legend(["cyan", "voisinage de x"], ["rose", "voisinage de y"], ["gold", "points"]),
    pointLabels: ["x", "x′"],
    views: [all, view("Autour de x", "L'ouvert U contient x et ne rencontre pas V.", "left", "point"), view("Autour de x′", "L'ouvert V contient x′ et ne rencontre pas U.", "right", "point")],
  },
  "Proposition 1.1.18": {
    kind: "separation", title: "Un singleton est fermé", formula: "E ∖ {x} est ouvert",
    description: "La séparation fournit, autour de chaque y ≠ x, un ouvert qui évite x.",
    legend: legend(["cyan", "voisinage de x"], ["rose", "voisinage de y"], ["gold", "points"]),
    views: [all, view("Autour de x", "L'ouvert U contient x.", "left", "point"), view("Autour de y", "L'ouvert V contient y et ne contient pas x.", "right", "point")],
    proof: [
      view("Étape 1", "On veut montrer que le complémentaire de {x} est ouvert.", "point", "right"),
      view("Étape 2", "On choisit un point y différent de x.", "point"),
      view("Étape 3", "Deux voisinages ouverts disjoints séparent x et y.", "left", "right", "point"),
      view("Étape 4", "Le voisinage de y ne contient pas x : il est dans E ∖ {x}.", "right", "point"),
      view("Étape 5", "Le complémentaire est un voisinage de chacun de ses points.", "right", "point"),
      view("Étape 6", "Son complémentaire {x} est donc fermé.", "left", "point"),
    ],
  },
  "Définition 1.2.1": {
    kind: "boundary", title: "Intérieur, adhérence, frontière", formula: "A = D° ∪ {p}   ·   ∂A = ∂D ∪ {p}",
    description: "Exemple dans ℝ² : A est un disque ouvert D° et un point isolé p. Choisissez une notion pour l'explorer.",
    legend: legend(["cyan", "intérieur"], ["gold", "frontière"], ["rose", "point isolé p"]), views: BOUNDARY_VIEWS,
  },
  "Exemples 1.2.2": {
    kind: "boundary", title: "Explorer les points de A", formula: "A° ⊂ A ⊂ Ā",
    description: "Pour ce disque ouvert accompagné d'un point isolé, comparez intérieur, adhérence et frontière.",
    legend: legend(["cyan", "intérieur"], ["gold", "frontière"], ["rose", "point isolé"]), views: BOUNDARY_VIEWS,
  },
  "Propriétés 1.2.3": {
    kind: "boundary", title: "Le plus grand ouvert", formula: "A° ⊂ A ⊂ Ā",
    description: "L'intérieur est le plus grand ouvert inclus dans A ; l'adhérence est le plus petit fermé qui le contient.",
    legend: legend(["cyan", "intérieur"], ["gold", "frontière"], ["rose", "point isolé"]), views: BOUNDARY_VIEWS,
    proof: [
      view("Étape 1", "Un ouvert W autour d'un point intérieur est contenu dans A.", "interior", "local"),
      view("Étape 2", "Chaque point de W est également intérieur à A.", "local"),
      view("Étape 3", "L'intérieur est donc voisinage de chacun de ses points : il est ouvert.", "interior"),
      view("Étape 4", "Tout ouvert U contenu dans A est aussi contenu dans son intérieur.", "interior", "subset-open"),
      view("Étape 5", "Hors de l'adhérence, un voisinage évite A : c'est l'intérieur de Aᶜ.", "outside"),
      view("Étape 6", "Tout fermé qui contient A contient aussi son adhérence.", "closure"),
    ],
  },
  "Propriété 1.2.4": {
    kind: "boundary", title: "La frontière de A", formula: "∂A = Ā ∩ (Aᶜ)̄",
    description: "Le cercle et le point isolé sont à la fois adhérents à A et à son complémentaire.",
    legend: legend(["cyan", "intérieur"], ["gold", "frontière"], ["rose", "point isolé"]), views: BOUNDARY_VIEWS,
    proof: [
      view("Étape 1", "Par définition, la frontière est l'adhérence privée de l'intérieur.", "closure", "boundary"),
      view("Étape 2", "Le complémentaire de l'intérieur de A est l'adhérence de Aᶜ.", "outside", "boundary"),
      view("Étape 3", "La frontière est donc l'intersection des deux adhérences.", "boundary"),
    ],
  },
  "Propriétés 1.2.5–6": {
    kind: "boundary", title: "Ouvert ou fermé ?", formula: "U ouvert ⇔ U° = U",
    description: "L'exemple permet de comparer une partie à son intérieur et à son adhérence.",
    legend: legend(["cyan", "intérieur"], ["gold", "frontière"], ["rose", "point isolé"]), views: BOUNDARY_VIEWS,
  },
  "Proposition 1.3.1": {
    kind: "subspace", title: "La topologie induite", formula: "τA = {O ∩ A : O ∈ τ}",
    description: "Une boule ouverte de l'espace ambiant coupe le plan A : sa trace est ouverte dans A.",
    legend: legend(["violet", "plan A"], ["gold", "ouvert O"], ["cyan", "trace O ∩ A"]), views: SUBSPACE_VIEWS,
    proof: [
      view("Étape 1", "Les traces de ∅ et de E sur A sont ∅ et A.", "plane"),
      view("Étape 2", "Une intersection de traces est la trace d'une intersection d'ouverts.", "sphere", "intersection"),
      view("Étape 3", "Une réunion de traces est la trace de la réunion : les axiomes sont vérifiés.", "plane", "sphere", "intersection"),
    ],
  },
  "Définition 1.3.2": {
    kind: "subspace", title: "Un ouvert relatif", formula: "U = O ∩ A",
    description: "Un sous-espace porte la topologie des traces des ouverts de l'espace ambiant.",
    legend: legend(["violet", "sous-espace A"], ["gold", "ouvert O"], ["cyan", "ouvert relatif"]), views: SUBSPACE_VIEWS,
  },
  "Exemple 1.3.4": {
    kind: "subspace", title: "Ouvert dans un sous-espace", formula: "U = A ∩ O",
    description: "Comme dans l'exemple de l'intervalle du cours, un ouvert relatif est la trace d'un ouvert ambiant.",
    legend: legend(["violet", "sous-espace A"], ["gold", "ouvert O"], ["cyan", "trace"]), views: SUBSPACE_VIEWS,
  },
  "Proposition 1.3.5": {
    kind: "subspace", title: "Voisinage relatif", formula: "V = W ∩ A",
    description: "La trace d'un voisinage ambiant W sur A est un voisinage dans le sous-espace.",
    legend: legend(["violet", "sous-espace A"], ["gold", "voisinage W"], ["cyan", "trace V"]), views: SUBSPACE_VIEWS,
    proof: [
      view("Étape 1", "Si W est un voisinage de a dans E, il contient un ouvert O autour de a.", "sphere"),
      view("Étape 2", "La trace O ∩ A est ouverte dans A et contenue dans W ∩ A.", "sphere", "intersection"),
      view("Étape 3", "Réciproquement, un voisinage V dans A contient la trace O ∩ A.", "intersection", "plane"),
      view("Étape 4", "W = O ∪ V est un voisinage dans E et sa trace sur A est V.", "sphere", "intersection", "plane"),
    ],
  },
  "Définition 1.3.7": {
    kind: "quotient", title: "Identifier des points", formula: "ℝ / ℤ ≅ S¹",
    description: "Dans cet exemple, 0 et 1 sont identifiés : ils ont la même image sur le cercle quotient.",
    legend: legend(["cyan", "points de ℝ"], ["gold", "cercle quotient"], ["rose", "même classe"]),
    views: [all, view("Avant quotient", "Sur ℝ, les points 0 et 1 sont distincts.", "source"), view("Après quotient", "Leurs images coïncident dans ℝ / ℤ.", "target", "class"), view("Projection q", "La projection envoie chaque réel t sur sa classe [t].", "arrows", "source", "target")],
  },
  "Définition 1.3.9": {
    kind: "product", title: "Un ouvert produit", formula: "U × V ⊂ ℝ × ℝ",
    description: "Le produit de deux intervalles ouverts est un rectangle ouvert dans le plan produit.",
    legend: legend(["cyan", "intervalle U"], ["rose", "intervalle V"], ["gold", "pavé U × V"]),
    views: [all, view("U", "Choisissez une première coordonnée dans l'intervalle U.", "u"), view("V", "Choisissez une seconde coordonnée dans l'intervalle V.", "v"), view("U × V", "Toutes les paires (u, v) forment le pavé ouvert U × V.", "product", "u", "v")],
  },
  "Définition 1.4.1": {
    kind: "mapping", title: "Limite et voisinages", formula: "f(U) ⊂ V",
    description: "Dans cet exemple avec f = id sur ℝ³, le voisinage U autour de a est envoyé dans V autour de b = a.",
    legend: legend(["cyan", "voisinage U"], ["violet", "voisinage V"], ["gold", "application f"]), views: MAP_VIEWS,
  },
  "Théorème 1.4.4": {
    kind: "separation", title: "Unicité de la limite", formula: "V ∩ V′ = ∅",
    description: "Dans un espace séparé, deux limites distinctes admettraient des voisinages disjoints.",
    legend: legend(["cyan", "voisinage de b"], ["rose", "voisinage de b′"], ["gold", "limites supposées"]),
    pointLabels: ["b", "b′"], regionLabels: ["V", "V′"],
    views: [all, view("Deux limites ?", "Si b et b′ étaient distincts, leurs voisinages pourraient être choisis disjoints.", "left", "right", "point")],
    proof: [
      view("Étape 1", "On suppose deux limites distinctes b et b′.", "point"),
      view("Étape 2", "La séparation donne deux voisinages disjoints V et V′.", "left", "right"),
      view("Étape 3", "La définition des limites fournit deux voisinages U et U′ de a.", "left", "right", "point"),
      view("Étape 4", "L'image de U ∩ U′ devrait être contenue dans V ∩ V′ = ∅.", "left", "right"),
      view("Étape 5", "Mais a ∈ U ∩ U′ : son image existe. C'est une contradiction.", "point"),
    ],
  },
  "Définition 1.4.5": {
    kind: "mapping", title: "Continuité en un point", formula: "∀V ∈ 𝒱f(a), ∃U ∈ 𝒱a : f(U) ⊂ V",
    description: "Pour f = id, tout petit voisinage de a est envoyé sur un voisinage de f(a).",
    legend: legend(["cyan", "U autour de a"], ["violet", "V autour de f(a)"], ["gold", "application f"]), views: MAP_VIEWS,
  },
  "Théorème 1.4.6": {
    kind: "mapping", title: "Continuité par les ouverts", formula: "V ouvert ⇒ f⁻¹(V) ouvert",
    description: "Exemple : avec f = id entre deux copies de ℝ³, l'image réciproque d'une boule ouverte est ouverte.",
    legend: legend(["cyan", "image réciproque"], ["violet", "ouvert V"], ["gold", "application f"]), views: MAP_VIEWS,
    proof: [
      view("Étape 1", "La continuité envoie les points adhérents dans l'adhérence de l'image.", "source", "target", "arrows"),
      view("Étape 2", "L'inclusion des adhérences entraîne que l'image réciproque d'un fermé est fermée.", "source", "target"),
      view("Étape 3", "Par passage au complémentaire, l'image réciproque d'un ouvert est ouverte.", "source", "target", "arrows", "inverse"),
      view("Étape 4", "L'image réciproque d'un ouvert autour de f(x) fournit un voisinage de x.", "source", "points", "inverse"),
    ],
  },
  "Corollaire 1.4.7": {
    kind: "composition", title: "Composer deux applications", formula: "(g ∘ f)⁻¹(V) = f⁻¹(g⁻¹(V))",
    description: "Les points passent du premier espace au troisième en suivant successivement f puis g.",
    legend: legend(["cyan", "espace E"], ["violet", "espace F"], ["gold", "espace H"]),
    views: [all, view("Application f", "La première application envoie E vers F.", "source", "middle", "first"), view("Application g", "La seconde application envoie F vers H.", "middle", "target", "second")],
    proof: [
      view("Étape 1", "On prend un ouvert V de H et on remonte par g⁻¹.", "target", "middle", "second", "inverse"),
      view("Étape 2", "La continuité de g puis de f donne deux images réciproques ouvertes.", "source", "middle", "target", "inverse"),
      view("Étape 3", "L'image réciproque de V par g ∘ f est ouverte.", "source", "middle", "target", "first", "second"),
    ],
  },
  "Définition 1.4.8": {
    kind: "torus", title: "Une déformation réversible", formula: "f et f⁻¹ continues",
    description: "Le tore est étiré par des changements d'échelle non nuls : la déformation est continue et réversible.",
    legend: legend(["gold", "surface du tore"], ["violet", "déformation continue"]),
    views: [all, view("Le tore", "Le trou du tore reste présent tout au long de l'étirement.", "surface"), view("La déformation", "Chaque changement d'échelle reste strictement positif : on peut l'inverser.", "wire")],
  },
};

export const HOME_SCENE: SceneConfig = { ...SCENE_CONFIG["Définition 1.4.8"], layout: "hero" };

export const EXERCISE_SCENE_CONFIG: Record<string, SceneConfig> = {
  "1.1.3": {
    kind: "interval-disjoint", title: "Deux intervalles disjoints", formula: "]0,1[ ∪ ]2,3[ n'est pas un intervalle",
    description: "Les deux intervalles ouverts sont séparés : leur réunion ne contient pas 1,5.",
    legend: legend(["cyan", "premier intervalle"], ["violet", "second intervalle"], ["gold", "point manquant"]),
    views: [all, view("Premier intervalle", "L'intervalle ]0,1[ est un élément de la famille.", "first"), view("Second intervalle", "L'intervalle ]2,3[ est aussi dans la famille.", "second"), view("Le point 1,5", "Le point 1,5 manque à la réunion, entre deux de ses points.", "gap")],
    proof: [
      view("Étape 1", "Les deux intervalles sont des éléments de la famille.", "first", "second"),
      view("Étape 2", "Le point 1,5 manque à leur réunion : ce n'est pas un intervalle.", "first", "second", "gap"),
      view("Étape 3", "La famille n'est donc pas stable par réunion.", "gap", "first", "second"),
    ],
  },
  "1.1.4": {
    ...SCENE_CONFIG["Exemples 1.1.2"], title: "Réunion des singletons", formula: "A = ⋃ₓ∈A {x}",
    description: "Dans cet exemple discret, chaque singleton est ouvert et toute partie est une réunion de singletons.",
    proof: [
      view("Étape 1", "Si la topologie est discrète, chaque singleton est ouvert.", "open", "point"),
      view("Étape 2", "Par exemple, la partie {a,b} est la réunion des deux singletons {a} et {b}.", "point-0", "point-1", "open-0", "open-1"),
      view("Étape 3", "Par stabilité des réunions, toute partie est ouverte.", "region", "open", "point"),
    ],
  },
  E1: {
    kind: "finite-chain", title: "Des ouverts emboîtés", formula: "∅ ⊂ {a} ⊂ {a,b} ⊂ E",
    description: "Les régions représentent la chaîne d'ouverts de τ₂ sur E = {a,b,c}.",
    legend: legend(["cyan", "ouvert {a}"], ["violet", "ouvert {a,b}"], ["gold", "points de E"]),
    views: [all, view("{a}", "Le petit ouvert ne contient que a.", "open-a", "point-a"), view("{a,b}", "Le plus grand ouvert contient a et b, mais pas c.", "open-ab", "point-a", "point-b")],
    proof: [
      view("Étape 1", "Pour τ₁, la réunion {a} ∪ {b} = {a,b} manque à la famille.", "open-a", "open-b", "candidate", "point-a", "point-b"),
      view("Étape 2", "Pour τ₂, les ouverts {a} et {a,b} sont emboîtés.", "open-a", "open-ab", "point-a", "point-b"),
      view("Étape 3", "Les unions et intersections de cette chaîne restent dans τ₂.", "open-a", "open-ab", "region", "point-a", "point-b", "point-c"),
    ],
  },
  E2: {
    kind: "finite-chain", title: "Intérieur et adhérence en fini", formula: "τ = {∅, {a}, {a,b}, E}",
    description: "La chaîne d'ouverts permet de repérer les fermés par complémentation.",
    legend: legend(["cyan", "ouvert {a}"], ["violet", "ouvert {a,b}"], ["gold", "points de E"]),
    views: [all, view("{a}", "Le singleton {a} est ouvert.", "open-a", "point-a"), view("{a,b}", "La partie {a,b} est ouverte ; son complémentaire {c} est fermé.", "open-ab", "point-a", "point-b"), view("Fermé {b,c}", "Le complémentaire de l'ouvert {a} est le fermé {b,c}.", "closed-bc", "point-b", "point-c")],
    proof: [
      view("Étape 1", "Le complémentaire de {a} est le fermé {b,c}.", "closed-bc"),
      view("Étape 2", "Pour A = {b}, son adhérence est {b,c} et son intérieur est vide.", "closed-bc", "point-b", "point-c"),
      view("Étape 3", "Pour A = {a,c}, l'intérieur est {a} et l'adhérence est E.", "open-a", "region", "point-a", "point-b", "point-c"),
    ],
  },
  E3: {
    kind: "dense", title: "Deux ensembles denses", formula: "ℚ° = ∅   ·   ℚ̄ = ℝ   ·   ∂ℚ = ℝ",
    description: "Un échantillon schématique de rationnels et d'irrationnels s'approche de x. La densité se démontre pour tout intervalle.",
    legend: legend(["cyan", "rationnels"], ["violet", "irrationnels"], ["gold", "point x"]),
    views: [all, view("Rationnels", "La densité de ℚ signifie que tout intervalle ouvert contient un rationnel.", "rational", "point"), view("Irrationnels", "Tout intervalle ouvert contient aussi un irrationnel.", "irrational", "point")],
    proof: [
      view("Étape 1", "Tout intervalle contient un irrationnel : l'intérieur de ℚ est vide.", "irrational", "point"),
      view("Étape 2", "Tout intervalle contient un rationnel : chaque réel est adhérent à ℚ.", "rational", "point"),
      view("Étape 3", "La frontière est ℚ̄ ∖ ℚ° = ℝ.", "rational", "irrational", "point"),
    ],
  },
  E4: {
    kind: "set-union", title: "Adhérence d'une réunion", formula: "(A ∪ B)̄ = Ā ∪ B̄",
    description: "Exemple avec deux boules ouvertes : la réunion de leurs adhérences contient aussi leurs bords.",
    legend: legend(["cyan", "A"], ["violet", "B"], ["gold", "adhérences"]),
    views: [all, view("A et B", "Les deux régions ouvertes forment A ∪ B.", "first", "second"), view("Adhérences", "Leurs adhérences incluent aussi les points des bords.", "closures")],
    proof: [
      view("Étape 1", "A et B sont inclus dans leur réunion ; leurs adhérences le sont aussi dans celle de la réunion.", "first", "second", "closures"),
      view("Étape 2", "La réunion finie Ā ∪ B̄ est fermée et contient A ∪ B.", "closures"),
      view("Étape 3", "La minimalité de l'adhérence donne l'autre inclusion.", "first", "second", "closures"),
    ],
  },
  E5: {
    kind: "interval-touch", title: "Un autre contre-exemple", formula: "A = ]−1,0[   ·   B = ]0,1[",
    description: "Autre exemple dans ℝ : A et B sont disjoints, mais leurs adhérences ont le point 0 en commun.",
    legend: legend(["cyan", "A"], ["violet", "B"], ["gold", "point 0"]),
    views: [all, view("A et B", "Les intervalles ouverts ne contiennent pas 0 et sont disjoints.", "first", "second"), view("Adhérences", "Le point 0 appartient aux deux adhérences.", "closure")],
    proof: [
      view("Étape 1", "Le corrigé utilise ℚ et son complémentaire ; le dessin présente un autre contre-exemple.", "first"),
      view("Étape 2", "Ici aussi, A ∩ B est vide.", "first", "second"),
      view("Étape 3", "Leurs adhérences se rencontrent pourtant en 0.", "closure"),
    ],
  },
  E6: {
    kind: "interval-adjacent", title: "Deux intervalles accolés", formula: "A = [0,1]   ·   B = [1,2]",
    description: "Le point 1 est dans l'intérieur de A ∪ B, mais pas dans A° ∪ B°.",
    legend: legend(["cyan", "A"], ["violet", "B"], ["gold", "point 1"]),
    views: [all, view("A° ∪ B°", "Le point 1 n'appartient à l'intérieur d'aucun des deux intervalles séparément.", "first", "second", "missing"), view("(A ∪ B)°", "La réunion vaut [0,2] : le point 1 est dans son intérieur.", "first", "second", "center")],
    proof: [
      view("Étape 1", "On choisit deux intervalles fermés qui se rejoignent en 1.", "first", "second", "center"),
      view("Étape 2", "Les intérieurs séparés ne contiennent pas leur extrémité commune.", "first", "second", "missing"),
      view("Étape 3", "L'intérieur de la réunion contient bien 1.", "first", "second", "center"),
    ],
  },
  "1.4.9": {
    ...SCENE_CONFIG["Théorème 1.4.6"], title: "L'identité entre deux espaces", formula: "Id homéomorphisme ⇔ τ = τ′",
    description: "Les deux copies de ℝ³ représentent l'identité : chaque point est envoyé sur lui-même.",
    proof: [
      view("Étape 1", "La continuité de Id donne l'inclusion τ′ ⊂ τ.", "source", "target", "arrows"),
      view("Étape 2", "La continuité de l'inverse donne l'inclusion τ ⊂ τ′.", "target", "source", "arrows", "inverse"),
      view("Étape 3", "Les deux inclusions donnent τ = τ′.", "source", "target", "points"),
    ],
  },
  E7: {
    ...SCENE_CONFIG["Exemples 1.1.2"], title: "Un espace fini discret", formula: "E fini et séparé ⇒ τ = 𝒫(E)",
    description: "Un exemple fini discret : chaque singleton est ouvert, et donc fermé.",
    proof: [
      view("Étape 1", "Dans un espace séparé, les singletons sont fermés.", "point"),
      view("Étape 2", "En fini, toute partie est une réunion finie de singletons fermés.", "point", "region"),
      view("Étape 3", "Toute partie est donc aussi ouverte : la topologie est discrète.", "open", "point", "region"),
    ],
  },
  E8: {
    kind: "neighborhood", title: "Intersection de deux ouverts", formula: "U = O ∩ A ∈ τ",
    description: "Dans cet exemple, O est une boule ouverte contenue dans la boule ouverte A.",
    regionLabels: ["A", "O"],
    legend: legend(["violet", "ouvert A"], ["cyan", "ouvert O"], ["gold", "point de U"]),
    views: [all, view("A", "La grande boule A est ouverte dans l'espace ambiant.", "outer"), view("O ∩ A", "La petite boule O est incluse dans A, donc O ∩ A = O.", "inner", "point")],
    proof: [
      view("Étape 1", "Tout ouvert relatif U est la trace d'un ouvert O sur A.", "inner", "point"),
      view("Étape 2", "O et A sont ouverts dans E, donc leur intersection aussi.", "inner", "outer"),
      view("Étape 3", "Ainsi U appartient à la topologie ambiante τ.", "inner", "point"),
    ],
  },
  E9: {
    kind: "characteristic", title: "Fonction caractéristique", formula: "𝟙A(x) = 1 si x ∈ A, sinon 0",
    description: "Dans cet exemple discret, deux points de A vont vers 1 ; le point de Aᶜ va vers 0.",
    legend: legend(["cyan", "A"], ["violet", "Aᶜ"], ["gold", "images 0 et 1"]),
    views: [all, view("A et son image", "Les points de A sont envoyés sur 1.", "first", "one"), view("Aᶜ et son image", "Les points de Aᶜ sont envoyés sur 0.", "second", "zero")],
    proof: [
      view("Étape 1", "Les images réciproques possibles sont ∅, A, Aᶜ et E.", "first", "second", "one", "zero", "arrows", "inverse"),
      view("Étape 2", "Un ouvert autour de 1 donne A ; un ouvert autour de 0 donne Aᶜ.", "first", "second", "one", "zero", "inverse"),
      view("Étape 3", "La continuité équivaut donc à l'ouverture de A et de Aᶜ.", "first", "second"),
    ],
  },
};
