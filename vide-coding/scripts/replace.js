const fs = require('fs');

let content = fs.readFileSync('arrodz.html', 'utf8');

const replacements = [
    // Meta & Title
    ['Arrodz | Agence communication hôtels &amp; restaurants', 'Builds | Construction & Engineering Services'],
    ['Agence spécialisée en communication digitale, branding et production de contenus pour hôtels, restaurants et chefs. Attirez la bonne clientèle.', 'Premium Construction & Engineering Services for world-class infrastructure and commercial builds.'],
    
    // Preloader
    ['<span class="loader-letter">A</span>', '<span class="loader-letter">B</span>'],
    ['<span class="loader-letter">R</span>', '<span class="loader-letter">U</span>'],
    ['<span class="loader-letter">R</span>', '<span class="loader-letter">I</span>'],
    ['<span class="loader-letter">O</span>', '<span class="loader-letter">L</span>'],
    ['<span class="loader-letter">D</span>', '<span class="loader-letter">D</span>'],
    ['<span class="loader-letter">Z</span>', '<span class="loader-letter">S</span>'],
    
    // Video
    ['https://cdn.prod.website-files.com/697b8432e6e6f25d089e5c95%2F69a1b56c9e63f5f277bd98e4_ARRODZ-Video_mp4.mp4', 'https://assets.mixkit.co/videos/preview/mixkit-building-a-brick-wall-with-cement-28491-large.mp4'],
    ['https://cdn.prod.website-files.com/697b8432e6e6f25d089e5c95%2F69a1b56c9e63f5f277bd98e4_ARRODZ-Video_webm.webm', 'https://assets.mixkit.co/videos/preview/mixkit-building-a-brick-wall-with-cement-28491-large.mp4'],
    
    // Hero
    ['We elevate hospitality brands to their highest potential.', 'We build the foundation of tomorrow.'],
    ['On aide les restaurants, hôtels et chefs à attirer une clientèle alignée, à renforcer la valeur perçue et à améliorer la récurrence grâce à une communication qui reflète fidèlement l’expérience que vous créez.', 'We deliver world-class infrastructure, commercial builds, and architectural engineering with precision and uncompromising quality.'],
    ['Faire rayonner mon établissement', 'Start Your Project'],
    ['Agence de communication', 'Premium Construction'],
    ['pour hôtels &amp; restaurants', '&amp; Engineering Services'],
    
    // Services
    ['Notre expertise', 'Our Expertise'],
    ['Des services pensés pour renforcer votre image et //attirer les bons clients//', 'Services designed to build your vision with //structural integrity//'],
    ['Notre travail repose sur trois leviers : visibilité, cohérence et valeur perçue. Ensemble, ils améliorent votre capacité à attirer, engager et fidéliser les bons clients.', 'Our work rests on three pillars: engineering excellence, sustainable materials, and uncompromising safety.'],
    
    ['Communication digitale', 'Architectural Design'],
    ['La communication est devenu un impératif', 'Modern & scalable blueprints'],
    ['Nous concevons des stratégies claires et impactantes, pensées pour créer de l’engagement et faire grossir des communautés. De la <strong>stratégie</strong>, à la <strong>conception de contenus</strong>, en passant par les <strong>publications sur vos plateformes</strong>, sans oublier l’<strong>interaction avec l’audience</strong>, nous gérons votre présence en ligne de façon complète, afin de renforcer votre visibilité et d’inscrire une image forte dans le paysage de façon durable.', 'We design modern, sustainable, and scalable blueprints that stand the test of time. Our architectural team ensures every project meets the highest standards.'],
    ['Parlons-en', 'Discuss blueprints'],
    
    ['Production de contenus', 'Commercial Construction'],
    ['La stratégie structure.<br/>Le contenu vous impose', 'Orchestrating the build site'],
    ['Une fois vos piliers de contenu définis, nous donnons vie aux idées. De la direction artistique à vos livrables, notre studio créatif orchestre l’ensemble de la chaîne de production.<br/><br/>Nos concepts créatifs à forte valeur ajoutée prennent forme à travers des <strong>productions photo et vidéo</strong>, intégrant <strong>rédaction</strong>, <strong>post-production et design</strong>, conçues pour capter l’attention, renforcer votre image de marque et générer un impact durable.', 'Our project managers orchestrate the entire build site with precision and uncompromising safety standards. We deliver commercial construction projects that shape the modern skyline.'],
    ['Créer du contenu', 'Hire contractors'],
    
    ['Branding &amp; identité visuelle', 'Infrastructure Engineering'],
    ['Le branding est le socle de votre marque.', 'Infrastructure is the backbone of society.'],
    ['Nous concevons des <strong>identités visuelles claires, cohérentes et durables</strong>, pensées pour être reconnues, mémorisées et facilement déclinées sur l’ensemble de vos points de contact. Au-delà de l’esthétique, nous construisons un univers capable de créer l’adhésion, de fédérer votre audience et d’installer une <strong>image lisible, alignée et différenciante</strong>.', 'We construct bridges, roads, and utilities with uncompromising quality and scale. Our engineering teams ensure long-lasting structural integrity for public works.'],
    ['Repenser mon identité', 'View Infrastructure'],
    
    // Case Studies
    ['Nos cas clients', 'Our Portfolio'],
    ['Quand l’image devient //un levier,// pas un décor', 'When structures become //landmarks,// not just buildings'],
    ['Quelques projets qui montrent comment une communication juste peut changer la perception d’un lieu, améliorer son attractivité et soutenir sa performance quotidienne.', 'A few projects that show our commitment to building world-class structures.'],
    
    ['La Dolce Vita Orient Express', 'The Grand Skyline'],
    ['Entre luxe et évasion découvrez une Croisière ferroviaire d’exception.', 'A state-of-the-art commercial skyscraper built with 100% sustainable materials.'],
    ['Production photo et vidéo', 'Commercial Build'],
    ['Découvrir le projet', 'View Details'],
    
    ['Vittorio Beltramelli', 'Riverside Complex'],
    ['Portrait d’un chef qui parle avec ses mains', 'Luxury residential development spanning over 50 acres of prime waterfront real estate.'],
    ['Gestion complète des réseaux sociaux', 'Residential'],
    
    ['Impérial Treasure', 'Titan Bridge'],
    ['Rendre ses lettres de noblesse à la gastronomie chinoise', 'An engineering marvel connecting two major cities across turbulent waters.'],
    
    ['Explorer d’autres réalisations', 'Explore more projects'],
    
    // Data section
    ['//Les chiffres parlent// pour nous', '//The numbers speak// for us'],
    ['1,5 M', '150+'],
    ['Followers et 75M d’impressions', 'Projects completed worldwide'],
    ['+ 50', '50+'],
    ['clients nous font confiance', 'Awards in engineering excellence'],
    ['+ 40 %', '100%'],
    ['d’engagement en moyenne sur les réseaux', 'Safety record over 5 years'],
    ['Parlez-nous de votre projet', 'Tell us about your project'],
    ['Nous contacter', 'Contact Us'],
    
    // Horizontal text
    ['Une agence qui travaille avec vous, pas que pour vous', 'A construction firm that builds with you, not just for you'],
    ['On observe, on écoute et on construit une communication qui colle à votre réalité. Pas de modèles appliqués, pas d’artifices : du vrai, du juste, du durable.', 'We observe, we plan, and we build infrastructure that meets your reality. No shortcuts, no artificial materials: real, strong, sustainable.'],
    ['Arrodz est née d’une idée simple : mettre en valeur les lieux où l’on aime vraiment aller. Ceux qui ont un univers, une équipe impliquée, un sens du détail.', 'Builds was born from a simple idea: creating structures that last generations.'],
    ['On comprend vos enjeux, pas juste vos demandes.', 'We understand your structural needs, not just your blueprint.'],
    
    // Footer CTA
    ['Envie d’avancer ?', 'Ready to build?'],
    ['Vous méritez une communication à la hauteur.', 'You deserve engineering at its finest.'],
    ['On commence ?', 'Shall we start?'],
    ['Un échange simple pour comprendre vos besoins, vos contraintes et ce que vous souhaitez améliorer, sans pression, juste avec franchise.', 'A simple exchange to understand your architectural needs, site constraints, and what you wish to build, without pressure.'],
    ['Réserver un échange', 'Get a Quote'],
    ['Gratuit et sans engagement', 'Free and without commitment'],
    
    // Footer Bottom
    ['On révèle ce qui vous distingue', 'We build what lasts'],
    ['On discute de votre projet ?', 'Discuss your blueprint?'],
    
    // Logo replacements for footer bottom (arrodz svg logos to text or just keep the letters we mapped)
    // Actually the letters mapped above will handle the preloader, footer letters might be different SVGs
];

for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
}

fs.writeFileSync('arrodz.html', content, 'utf8');
console.log('Replacements completed.');
