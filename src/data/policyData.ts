export interface PolicySectionClause {
  heading: string;
  body: string;
}

export interface PolicyArticle {
  id: 'article-1' | 'article-2' | 'article-3' | 'article-4';
  shortLabel: string;
  title: string;
  sections: PolicySectionClause[];
}

export interface PolicyTenet {
  number: number;
  title: string;
  summary: string;
  linkLabel: string;
  articleId: PolicyArticle['id'];
}

export const OFFICIAL_PARTNERSHIP_POLICY = {
  title: 'MIKEYFLIX STUDIOS - OFFICIAL PARTNERSHIP POLICY (READ NOW)',
  intro:
    'Welcome to Mikeyflix Studios. Our primary objective is to scale your brand to the highest digital echelons. For a transparent and frictionless collaboration, our foundational operational tenets are delineated below:',
  tenets: [
    {
      number: 1,
      title: '1. Secure Fiscal Remittance & 90-Day Growth Epoch',
      summary:
        'Building a formidable brand necessitates temporal consistency. Therefore, we operate strictly on a 90-day partnership paradigm to ensure algorithmic eminence. Your billing cycles and fiscal deposits are completely safeguarded to prevent any operational stagnation.',
      linkLabel: '[Read Detailed Financial & Refund Policy]',
      articleId: 'article-1',
    },
    {
      number: 2,
      title: '2. High-Velocity Workflow & Iterative Refinements',
      summary:
        'Market velocity is paramount. We guarantee an expeditious premium delivery turnaround spanning 12 to 48 hours. Furthermore, to facilitate immediate broadcasting, each multimedia asset is entitled to dual complimentary iterative refinements (minor adjustments).',
      linkLabel: '[Read Operational & Speed Protocols]',
      articleId: 'article-2',
    },
    {
      number: 3,
      title: '3. Brand Sequestration & Intellectual Property Security',
      summary:
        'Your raw footage, conceptual stratagems, and proprietary data remain unequivocally shielded from market adversaries. You will consistently receive high-fidelity, deployment-ready MP4 artifacts for immediate utilization.',
      linkLabel: '[Read IP & Copyright Security]',
      articleId: 'article-3',
    },
    {
      number: 4,
      title: '4. Safe Dissemination & Brand Liability',
      summary:
        'We strive for your brand to expand without legal encumbrances. Post-approval, stringent deployment mandates are in place to ensure your promotional integrity remains unblemished and both entities remain legally insulated.',
      linkLabel: '[Read Liability & Safe Publishing]',
      articleId: 'article-4',
    },
  ] satisfies PolicyTenet[],
  studioModelQuotes: {
    hinglish:
      '"Humara koi ek specific physical studio ek jagah par bounded nahi hai. Hum ek decentralized cloud model par kaam karte hain—jahan-jahan hamare top-tier editors aur creative systems connected hain, wahi hamara studio hai. Isse humein geographic limit ke bina best talent aur fast turnaround milta hai."',
    english:
      '"We are not confined to a single, fixed physical studio. We operate on a decentralized cloud model—wherever our top-tier editors and creative systems are connected, that is our studio. This allows us to access the best talent without geographic limitations and ensures a fast turnaround."',
    languageTag: 'Hinglish',
  },
  articles: {
    'article-1': {
      id: 'article-1',
      shortLabel: 'Article I · Financial & Refund Policy',
      title:
        'MASTER SERVICE COVENANT - ARTICLE I: COMPREHENSIVE FISCAL GOVERNANCE, INVIOLABLE NON-DISBURSEMENT STATUTES, AND RETROACTIVE PENALIZATION FRAMEWORKS',
      sections: [
        {
          heading:
            'Section 1.01(a) - The Inflexible Ninety-Day Temporal Epoch and Binding Retention Parameters',
          body: 'This collaborative multimedia enterprise, digital synthesis project, and overarching strategic partnership is inextricably tethered to a mandatory, continuous, and uninterrupted temporal epoch comprising exactly ninety (90) sequential diurnal cycles, commencing precisely from the timestamp of the initial fiscal remittance. The cultivation of algorithmic eminence, digital hegemony, and sustained brand velocity necessitates this precise, unalterable chronological runway. By initiating this engagement, authorizing the inaugural fiscal remittance, digitally authenticating any onboarding documentation, or transferring raw digital assets to our encrypted servers, the Client irrevocably subjugates their corporate entity, subsidiaries, assignees, and legal representatives to this non-negotiable retention period. Any premeditated, spontaneous, or strategically orchestrated abrogation, dissolution, or severance of this partnership prior to the culmination of the aforementioned ninety-day epoch shall be categorically classified as a catastrophic breach of the Master Service Agreement.',
        },
        {
          heading:
            'Section 1.01(b) - Absolute Reiteration of Studio Sovereignty and Contractual Continuity',
          body: 'Notwithstanding any subjective dissatisfaction, internal corporate restructuring by the Client, external macroeconomic fluctuations, platform algorithm updates, or localized market volatility, the 90-day retention epoch remains absolute and inviolable. The Studio exercises supreme and unilateral discretion in enforcing this continuity and outright rejects any petitions for early termination, prorated settlements, or mutual dissolution prior to the ninety-day terminus.',
        },
        {
          heading:
            'Section 1.02(a) - Pre-emptive Fiscal Liquidation and Advance Remuneration Protocols',
          body: 'The operational apparatus of Mikeyflex Studios functions strictly and exclusively upon a pre-emptive fiscal acquisition methodology. The Client is legally compelled and unconditionally bound to execute the full, unmitigated transfer of the agreed-upon monthly remuneration prior to the commencement of any creative, editorial, strategic, or post-production stratagems. This fiscal liquidation must be unambiguously reflected and financially cleared within the Studio’s designated banking infrastructure no later than the first chronological business day of each respective billing cycle.',
        },
        {
          heading:
            'Section 1.03(a) - The Absolute Non-Refundable Stipulation and Asset Forfeiture',
          body: 'It is a foundational cornerstone doctrine of this covenant that any and all fiscal deposits, advance payments, retainers, and compensatory transfers relinquished unto Mikeyflex Studios are categorized as strictly and unequivocally NON-REFUNDABLE in perpetuity. This statutory immutability remains steadfast regardless of unilateral client dissatisfaction, sudden strategic pivots, subjective aesthetic disagreements, or internal corporate restructuring on the part of the Client. The Client explicitly waives any legal right to initiate chargebacks, financial disputes, or arbitrary clawbacks through their financial institutions.',
        },
        {
          heading:
            'Section 1.04(a) - The Retroactive Amortization Trap and Punitive Clawback Mechanisms',
          body: 'Should the Client orchestrate a premature departure or hostile termination preceding the ninety-day terminus, the Client shall automatically forfeit any inherent right to partial reimbursement for unutilized bandwidth. Concurrently, this premature severance activates the Retroactive Amortization Trap. Any ancillary services initially provided as "complimentary," "introductory," or "bonus" deliverables—specifically including, but not strictly limited to, the Artificial Intelligence synthesized multimedia assets and the exhaustive Search Engine Optimization (SEO) Competitor Blueprint (valued empirically and legally at 15,000 INR)—shall be instantaneously reclassified as aggressively billable deliverables. The Client will be subjected to immediate punitive invoicing for these previously waived expenditures at their absolute peak market valuation. Payment for these retroactively billed assets is mandated immediately upon receipt of the invoice, under threat of aggressive, multi-jurisdictional litigation.',
        },
      ],
    },
    'article-2': {
      id: 'article-2',
      shortLabel: 'Article II · Operational & Speed Protocols',
      title:
        'MASTER SERVICE COVENANT - ARTICLE II: OPERATIONAL METHODOLOGIES, ITERATIVE EXHAUSTION, AND CHRONOLOGICAL PROCRASTINATION PENALTIES',
      sections: [
        {
          heading:
            'Section 2.01(a) - Iterative Exhaustion, Micro-Refinement Thresholds, and the Mathematical Ceiling',
          body: 'To preserve the relentless velocity of our post-production pipeline and preempt the deleterious effects of conceptual scope creep, Mikeyflex Studios institutes an uncompromising mathematical ceiling on aesthetic modifications. Each individual multimedia asset is allocated a maximum threshold of exactly two (2) complimentary, minor iterative refinements. A "minor refinement" is rigorously and exclusively defined as a localized typographical correction (e.g., spelling errors in subtitles), a fractional auditory leveling adjustment (e.g., volume normalization), or a superficial colorimetric shift that does not alter the fundamental pacing, narrative structure, or timeline architecture of the asset.',
        },
        {
          heading:
            'Section 2.01(b) - Bespoke Remuneration Paradigm for Supernumerary Requisitions',
          body: 'Should the Client requisition a tertiary iteration, or conversely, mandate a substantive alteration to the foundational conceptual architecture, narrative arc, or structural pacing of the asset, such requisitions shall categorically transcend the boundaries of the original financial covenant. These supernumerary demands will be summarily classified as a "Novel Bespoke Enterprise." Consequently, they will incur supplementary, punitive invoicing—calculated via premium hourly rates or a customized flat-rate penalty—executed entirely at the unilateral discretion of the Studio\'s governing board.',
        },
        {
          heading:
            'Section 2.02(a) - Absolute Nullification of Synchronous Vocalized Directives and Epistemological Mandates',
          body: 'The epistemology of our creative workflow demands absolute, undeniable, and archival codification. Ergo, any and all instructions, aesthetic preferences, structural critiques, strategic pivots, or final ratifications transmitted via synchronous vocalization—including, but not limited to, telephonic conversations, in-person verbal edicts, voice-note transmissions, virtual video conferences, or informal auditory passing remarks—are deemed legally void, operationally non-existent, and entirely imperceptible to our production apparatus.',
        },
        {
          heading: 'Section 2.02(b) - The Asynchronous Codification Mandate',
          body: 'The Studio shall only acknowledge, process, and execute directives that have been explicitly codified and transmitted through designated asynchronous digital telecommunication channels (specifically, formally documented WhatsApp textual messaging or formalized Electronic Mail correspondence). The Client bears the sole responsibility of transcribing any vocalized thoughts into written, auditable directives.',
        },
        {
          heading:
            'Section 2.03(a) - The Chronological Procrastination Clause and Client-Initiated Delays',
          body: "The symbiotic nature of this high-performance partnership demands punctual reciprocity. Should the Client exhibit any lethargy, hesitation, or procrastination exceeding twenty-four (24) chronological hours in the provisioning of requisite raw materials, foundational data, script approvals, or pivotal iterative confirmations, the Studio’s overarching delivery terminus shall be automatically and proportionately elongated. The Studio bears absolute zero punitive liability, neither fiscal nor reputational, for deployment delays spawned by the Client's own operational inertia.",
        },
        {
          heading:
            'Section 2.03(b) - Zero-Compromise Temporal Exemption for Studio Operations',
          body: "Furthermore, any transient dilation in the Studio’s delivery timelines orchestrated internally by Mikeyflex Studios shall not be construed as a breach of punctuality or a logistical delay, but rather as an intentional manifestation of our rigorous, multi-layered quality-assurance distillation. The Studio shall never be penalized, fiscally reprimanded, or legally challenged for dedicating supplementary temporal resources to ensure the unassailable perfection of the final visual artifact. The Client explicitly waives the right to demand rushed delivery that compromises the Studio's internal quality matrices.",
        },
      ],
    },
    'article-3': {
      id: 'article-3',
      shortLabel: 'Article III · IP & Copyright Security',
      title:
        'MASTER SERVICE COVENANT - ARTICLE III: ABSOLUTE MONOPOLIZATION OF INTELLECTUAL PROPERTY, ASSET SEQUESTRATION, AND DMCA ENFORCEMENT',
      sections: [
        {
          heading:
            'Section 3.01(a) - Exclusive Sovereignty Over Raw Schematics and Digital Architecture',
          body: 'The patron is legally entitled exclusively to the fully rendered, finalized, and compressed MP4 manifestation of the audiovisual project, serving solely as the final delivery mechanism for public broadcast. The unadulterated source footage (.braw, .r3d, .mp4, .mov), intricate timeline chronologies engineered within DaVinci Resolve (.drp), proprietary colorimetric Look-Up Tables (LUTs), multi-layered auditory soundscapes, customized motion graphics templates, and complex Adobe After Effects composite hierarchies (.aep) remain the exclusive, non-transferable, and absolute intellectual sovereignty of Mikeyflex Studios in perpetuity.',
        },
        {
          heading: 'Section 3.01(b) - Irrevocable Waiver of Asset Requisition',
          body: 'The Client implicitly and permanently waives any and all rights to demand, subpoena, extort, purchase, or otherwise requisition these foundational architectural files, recognizing that they constitute the closely guarded trade secrets, proprietary methodologies, and competitive advantages of the Studio. Any attempt to forcefully acquire these assets will be treated as industrial espionage.',
        },
        {
          heading:
            'Section 3.02(a) - Hostile Copyright Withholding and Digital Eradication Prerogative',
          body: 'Commercial broadcasting rights, monetization privileges, and public dissemination permissions are unequivocally suspended, actively withheld, and legally heavily restricted until the complete and unmitigated liquidation of all outstanding invoices pertaining to the respective billing cycle is achieved. Should the Client brazenly attempt to broadcast, upload, monetize, or otherwise distribute the aforementioned artifacts across any digital, terrestrial, or satellite medium without having achieved absolute fiscal equilibrium with the Studio, such actions shall constitute blatant intellectual property theft and international copyright infringement.',
        },
        {
          heading: 'Section 3.02(b) - The DMCA Unilateral Strike Protocol',
          body: 'Consequently, Mikeyflex Studios retains the immediate, unchallengeable, and highly aggressive prerogative to instigate Digital Millennium Copyright Act (DMCA) takedown subroutines. The Studio will weaponize global regulatory frameworks to obliterate the infringing media from all social networks (including but not limited to Meta, Alphabet, and ByteDance properties), hosting platforms, and digital repositories, without any prerequisite of prior notification, warning, or arbitration with the Client.',
        },
        {
          heading:
            'Section 3.03(a) - Clandestine Portfolio Exploitation and Asymmetrical Privacy Protocols',
          body: "Mikeyflex Studios pledges to shield the Client's proprietary stratagems, unreleased conceptual data, and internal market maneuvering from local market adversaries. Notwithstanding this pledge of overarching confidentiality, the Studio retains the irrevocable, perpetual, global, and unchallengeable prerogative to leverage the finalized, publicly broadcasted artifacts as pedagogical instruments, demonstrative case studies, and marketing collateral. These assets may be exhibited freely within our cloistered, highly curated client-acquisition symposiums, digital portfolios, and private directorial pitches to illustrate the Studio’s supreme technical prowess, without requiring supplementary consent or offering subsequent financial royalties to the Client.",
        },
      ],
    },
    'article-4': {
      id: 'article-4',
      shortLabel: 'Article IV · Liability & Safe Publishing',
      title:
        'MASTER SERVICE COVENANT - ARTICLE IV: ULTIMATE JURISTIC IMMUNITY, THIRD-PARTY INDEMNIFICATION, AND UNILATERAL LIABILITY SUBJUGATION',
      sections: [
        {
          heading:
            'Section 4.01(a) - The Absolution of Culpability upon Final Digital Ratification',
          body: "The functional jurisdiction and legal responsibility of Mikeyflex Studios are strictly and rigidly confined to the digital synthesis, kinetic assembly, and aesthetic manipulation of audiovisual media. The exact millisecond the Client issues a digital imprimatur—signified by an affirmative textual confirmation (e.g., 'Final Ok', 'Approved', 'Looks Good', 'Proceed') via the mandated asynchronous communication channels—a complete, immediate, and irreversible transfer of all juristic, ethical, and fiscal liability occurs.",
        },
        {
          heading: 'Section 4.01(b) - Total Assumption of Risk by the Client',
          body: "By authenticating the artifact, the Client accepts the media in its absolute entirety, comprehensively adopting all associated risks, thereby fully and permanently absolving the Studio of any ongoing editorial, legal, or moral stewardship over the published content. The Studio’s liability drops to absolute zero the moment the 'Final Ok' is transmitted.",
        },
        {
          heading:
            'Section 4.02(a) - Unilateral Third-Party Indemnification and Algorithmic Immunity',
          body: 'Post-publication, Mikeyflex Studios is categorically, comprehensively, and eternally exonerated from any fiscal, punitive, algorithmic, or reputational repercussions that may manifest in the public domain. Should the published artifact precipitate a third-party copyright strike due to contested acoustic licensing disputes, visual infringement claims, typographical misrepresentations of pricing architectures, lack of commercial usage rights for specific fonts, or the dissemination of fallacious, deceptive, or legally non-compliant promotional offers, the Client bears the absolute and undivided brunt of the fallout.',
        },
        {
          heading: "Section 4.02(b) - Client's Obligation to Defend and Reimburse the Studio",
          body: 'The Client agrees to wholly indemnify, defend, financially reimburse, and hold harmless Mikeyflex Studios, its contractors, its directors, and its infrastructural partners against any and all litigations, account deprecations, shadow-banning penalties, or financial hemorrhages orchestrated by platform moderators, regulatory bodies (e.g., FTC, ASCI), or aggrieved consumer demographics. The Studio shall not bear a single cent of legal costs arising from client-approved media.',
        },
        {
          heading:
            'Section 4.03(a) - Irrevocable Subjugation to the Master Service Covenant',
          body: 'Engagement with the primary contractual hub, the provisioning of raw materials, or the authorization of the initial fiscal invoice solidifies an irrevocable, legally binding capitulation to these exhaustive stipulations. The Client acknowledges that they have been provided ample digital opportunity to review this expansive lexicon and have voluntarily bypassed any comprehensive legal analysis in favor of immediate operational commencement.',
        },
        {
          heading: 'Section 4.03(b) - Eradication of Client Legal Recourse',
          body: 'All arbitrations, disputes, and jurisprudential conflicts arising from this covenant are tethered exclusively to the jurisdictional hegemony chosen unilaterally by Mikeyflex Studios. This effectively strips the Client of any advantageous legal recourse, class-action participation, or venue manipulation. The Client surrenders their right to litigate in their home jurisdiction and submits entirely to the operational authority of Mikeyflex Studios.',
        },
      ],
    },
  } satisfies Record<PolicyArticle['id'], PolicyArticle>,
};
