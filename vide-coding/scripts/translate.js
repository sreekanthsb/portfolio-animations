const fs = require('fs');
let html = fs.readFileSync('arrodz.html', 'utf8');

const dict = {
  'Qu’est-ce qui vous différencie des autres agences ?': 'What sets you apart from other agencies?',
  'Ce qui nous différencie, c’est avant tout notre structure et notre niveau d’exigence.': 'What sets us apart is primarily our structure and high standards.',
  'Contrairement à de nombreuses agences où une seule personne gère tout, souvent débordée et avec trop de clients, vous bénéficiez chez nous d’une équipe dédiée de spécialistes, chacun expert de son métier. Cela garantit une meilleure qualité d’exécution, plus de réactivité et un véritable suivi.': 'Unlike many firms where one person manages everything, often overwhelmed, you benefit from a dedicated team of specialists. This guarantees better execution quality, more responsiveness, and real follow-up.',
  'Nous nous distinguons également par notre cadre de travail structuré et proactif. Là où certaines agences attendent les demandes du client sans réelle feuille de route, nous définissons des objectifs clairs, proposons des actions concrètes et pilotons les stratégies dans la durée, ce qui permet d’obtenir des résultats mesurables.': 'We also stand out with our structured and proactive framework. Where others wait for requests, we define clear goals, propose concrete actions, and manage strategies long-term for measurable results.',
  'Enfin, nous investissons continuellement dans des équipements et outils professionnels, afin d’assurer des standards élevés que peu d’agences maintiennent réellement dans le temps.': 'Finally, we continuously invest in professional equipment and tools to ensure high standards that few maintain over time.',
  'Quels types de prestations proposez-vous ?': 'What types of services do you offer?',
  'Nous proposons trois grands types de prestations complémentaires.': 'We offer three main types of complementary services.',
  '• La gestion complète de votre communication digitale : stratégie, création de contenu et pilotage quotidien de vos réseaux sociaux, avec un objectif clair : développer votre visibilité et faire grandir votre communauté.': '• Full management of your engineering projects: strategy, planning, and daily oversight to build effectively.',
  '• La production de contenu audiovisuel (prestations “one-shot” à la demande) : photo, vidéo et créations graphiques pour une inauguration, une nouvelle carte, un événement ou une collaboration. Les contenus sont livrés dans des délais définis et conçus pour alimenter efficacement vos réseaux, votre site et vos supports de communication.': '• Commercial construction (on-demand services): building and structural execution for new sites. Delivered within defined deadlines to meet your needs.',
  '• La création ou refonte de votre identité visuelle : logo, univers graphique et cohérence de marque, afin de construire une image forte, lisible et mémorable.': '• Architectural design: creating sustainable blueprints and strong structural plans for memorable landmarks.',
  'Travaillez-vous avec tout type d’établissement ?': 'Do you work with all types of properties?',
  'Nous travaillons exclusivement avec les acteurs de l’hôtellerie, de la restauration et les marques de gastronomie.': 'We work exclusively with commercial, industrial, and major infrastructure developers.',
  'Nous privilégions les établissements qui portent une véritable identité : une histoire, un positionnement fort, le goût du beau et du bon, ou un élément différenciant. C’est ce qui nous permet de déployer des stratégies de communication réellement impactantes.': 'We favor projects with a strong vision and structural significance. This allows us to deploy truly impactful engineering strategies.',
  'Si vous avez un doute sur votre profil, le plus simple reste de prendre rendez-vous afin d’évaluer ensemble la pertinence d’un accompagnement.': 'If you have doubts about your project scope, the easiest way is to book an appointment to evaluate it together.',
  'Comment se déroule la collaboration ?': 'How does the collaboration work?',
  'Nous travaillons par cycles de 3 mois, afin d’assurer une stratégie structurée, mesurable et évolutive.': 'We work in clear phases to ensure structured, measurable, and scalable execution.',
  'Chaque période suit une méthode claire : définition des objectifs, construction du plan d’action, déploiement des actions (contenus, activations, pilotage), puis analyse des résultats et ajustements.': 'Each period follows a clear method: goal definition, action plan construction, deployment (building, management), and then result analysis.',
  'Vous bénéficiez d’un chef de projet dédié, votre interlocuteur unique, qui coordonne l’ensemble des équipes et garantit le bon déroulement des actions.': 'You benefit from a dedicated project manager, your single point of contact, who coordinates teams and ensures smooth operations.',
  'Vos offres contiennent-elles un engagement ?': 'Do your offers require a commitment?',
  'Certains de nos services, comme la création de contenu, sont proposés en prestations ponctuelles (“one-shot”), activables à la demande et sans engagement.': 'Some of our services, like consultations, are offered as one-off services, available on demand without commitment.',
  'En revanche, nos offres d’accompagnement régulier fonctionnent avec un préavis de deux mois après le mois en cours, afin de couvrir les frais déjà engagés (outils, ressources, dispositifs stratégiques). Ce cadre garantit également la continuité et l’efficacité des actions mises en place.': 'However, regular building contracts operate with a two-month notice to cover committed costs (tools, resources). This ensures continuity and efficiency.',
  'Peut-on travailler sur une mission ponctuelle ?': 'Can we work on a one-off mission?',
  'Oui, bien sûr.': 'Yes, of course.',
  'Deux de nos trois services peuvent être activés sous forme de missions ponctuelles : la production de contenu photo-vidéo (pour un événement, une nouvelle carte, une ouverture, etc.) ainsi que la création ou refonte de votre identité visuelle.': 'Two of our three services can be activated as one-off missions: site evaluations and architectural design blueprints.',
  'Ces prestations peuvent être réalisées à la demande, sans engagement dans la durée.': 'These services can be carried out on demand, without long-term commitment.',
  'Quel résultat puis-je attendre ?': 'What results can I expect?',
  'Vous pouvez vous attendre à une communication professionnelle, cohérente et parfaitement alignée avec l’image de votre établissement.': 'You can expect professional, coherent structures perfectly aligned with your vision.',
  'Concrètement, cela se traduit par une visibilité fortement renforcée : plus d’abonnés chaque semaine, une portée plus importante sur vos contenus et la construction progressive d’une communauté engagée autour de votre marque.': 'In concrete terms, this translates to strong structural integrity, timely delivery, and sustainable buildings.',
  'Vous bénéficiez également d’une image plus valorisée, d’une meilleure perception auprès de votre clientèle, ainsi que d’une capacité accrue à attirer de nouveaux clients tout en fidélisant les existants.': 'You also benefit from an enhanced property value and a better perception by stakeholders.',
  'L’objectif est clair : reprendre le contrôle de votre communication pour en faire un véritable levier d’attractivité et de croissance.': 'The goal is clear: deliver world-class infrastructure as a lever for growth.',
  'En combien de temps le contenu est rendu ?': 'How long does a project take?',
  'Les délais de livraison varient selon le type de contenu et le niveau de production.': 'Delivery times vary depending on the type of build and level of production.',
  'Les contenus photo sont livrés sous 7 jours maximum.': 'Initial blueprints are delivered within 7 days maximum.',
  'Pour la vidéo, le délai dépend du type de prestation (ponctuelle ou continue) ainsi que de la complexité de production.': 'For actual construction, the timeframe depends on the project scope and complexity.',
  'Dans tous les cas, notre objectif reste le même : vous permettre d’exploiter vos contenus rapidement, tout en garantissant un niveau de qualité élevé.': 'In any case, our goal remains the same: to deliver your structure efficiently while guaranteeing high quality.',
  'Combien ça coûte ?': 'How much does it cost?',
  'Nos tarifs varient selon les services, mais reposent toujours sur une base fixe et évolutive.': 'Our rates vary according to the services, but are always based on a fixed and scalable foundation.',
  'Le budget évolue ensuite en fonction des options choisies, déterminées selon vos besoins et les objectifs que vous souhaitez atteindre.': 'The budget then evolves according to the chosen options, determined by your needs.',
  'Le plus pertinent reste d’en discuter ensemble afin de définir la solution la plus adaptée à votre projet et à votre enveloppe.': 'The best way is to discuss it together to define the most suitable solution for your project and budget.',
  'Avec quels outils travaillez-vous pour garantir la qualité ?': 'What tools do you use to ensure quality?',
  'Nous travaillons exclusivement avec des équipements et des outils professionnels.': 'We work exclusively with professional heavy machinery and tools.',
  'Que ce soit pour la création de contenu (caméras, éclairage, matériel de tournage) ou pour le pilotage des stratégies (logiciels d’analyse, de planification et de performance), tout notre écosystème repose sur des standards utilisés par les professionnels du secteur.': 'Whether for building construction, site excavation, or safety management, our ecosystem relies on industry standards.',
  'Vous ne nous verrez jamais filmer avec un iPhone : notre exigence de qualité impose des moyens techniques à la hauteur de l’image de nos clients.': 'You will never see us cut corners: our quality requirement imposes technical means that match our clients visions.',
  'Vous n’avez pas trouvé la réponse à votre question ou vous souhaitez nous contacter ?': 'Did not find the answer to your question or wish to contact us?',
  'Contactez-nous': 'Contact Us',
  'On révèle ce qui vous distingue': 'We reveal what sets you apart',
  'On discute de votre projet ?': 'Shall we discuss your project?',
  'Services': 'Services',
  'Nos projets': 'Our Projects',
  'À propos': 'About Us',
  'Foire aux questions': 'FAQ',
  'Mentions légales': 'Legal Notice',
  'Politique de confidentialité': 'Privacy Policy',
  'Un site fièrement réalisé par': 'A website proudly made by',
  'Tous droits réservés.': 'All rights reserved.',
  'Vos questions, //nos réponses,// sans détour': 'Your questions, //our answers,// directly',
  'On a regroupé ici les questions que les restaurants, hôtels et chefs nous posent le plus souvent, avec des réponses directes et sans détours.': 'We have gathered here the questions most often asked, with direct and straightforward answers.',
  'Questions fréquentes': 'Frequently Asked Questions',
  'Ce que //nos clients// en disent': 'What //our clients// say',
  'Ils nous font confiance': 'They trust us',
  'Les restaurants, hôtels et chefs nous choisissent pour notre façon de comprendre leur réalité et de créer une communication utile, durable et alignée avec leur identité.': 'Developers, governments, and corporations choose us for our structural excellence, sustainable approach, and unwavering commitment to safety.'
};

for (const [fr, en] of Object.entries(dict)) {
  html = html.split(fr).join(en);
}

fs.writeFileSync('arrodz.html', html);
console.log("Done");
