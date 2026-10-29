import os, zipfile, shutil

os.makedirs('public/figma-export', exist_ok=True)

def create_header(active_nav="HOME"):
    nav_items = [("HOME", "Home"), ("QUIZ", "The Test"), ("ARCHIVE", "Library"), ("ABOUT", "About"), ("CONTACT", "Contact")]
    links_svg = ""
    x_pos = 960
    for key, label in nav_items:
        is_active = (key == active_nav)
        if is_active:
            links_svg += f'''
            <rect x="{x_pos - 12}" y="18" width="{len(label)*9 + 24}" height="28" rx="14" fill="#111111"/>
            <text x="{x_pos}" y="36" fill="#F5F4EF" font-family="Poppins, sans-serif" font-size="11" font-weight="600" letter-spacing="1">{label.upper()}</text>
            '''
            x_pos += len(label)*9 + 32
        else:
            links_svg += f'''
            <text x="{x_pos}" y="36" fill="#777777" font-family="Poppins, sans-serif" font-size="11" font-weight="600" letter-spacing="1">{label.upper()}</text>
            '''
            x_pos += len(label)*9 + 28

    return f'''
    <g id="Header">
        <rect width="1440" height="64" fill="#F5F4EF"/>
        <line x1="0" y1="64" x2="1440" y2="64" stroke="#D9D9D4" stroke-width="1"/>
        <text x="150" y="38" fill="#111111" font-family="Poppins, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">HUMAN <tspan font-family="Newsreader, Georgia, serif" font-style="italic" font-weight="400" fill="#777777">OR</tspan> AI?</text>
        {links_svg}
    </g>
    '''

def create_footer(y_pos=940):
    return f'''
    <g id="Footer" transform="translate(0, {y_pos})">
        <line x1="150" y1="0" x2="1290" y2="0" stroke="#D9D9D4" stroke-width="1"/>
        <text x="150" y="35" fill="#777777" font-family="Poppins, sans-serif" font-size="12" font-weight="400">HUMAN OR AI? — Interactive Visual Experiment</text>
        <text x="1290" y="35" text-anchor="end" fill="#777777" font-family="Poppins, sans-serif" font-size="12" font-weight="400">Interactive Design Prototype</text>
    </g>
    '''


# 1. HOME SCREEN
def gen_home():
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1040" width="1440" height="1040" fill="none">
    <rect width="1440" height="1040" fill="#F5F4EF"/>
    {create_header("HOME")}
    
    <g id="Hero" transform="translate(720, 125)" text-anchor="middle">
        <text y="0" fill="#2A4365" font-family="Poppins, sans-serif" font-size="11" font-weight="700" letter-spacing="2">VISUAL EXPERIMENT</text>
        <text y="50" fill="#111111" font-family="Poppins, sans-serif" font-size="52" font-weight="800" letter-spacing="-1">CAN YOU TELL WHO MADE IT?</text>
        <text y="88" fill="#777777" font-family="Poppins, sans-serif" font-size="14" font-weight="400">In an era where machine synthesis rivals the human hand, can intuition still discern craft from code?</text>
        <text y="110" fill="#777777" font-family="Poppins, sans-serif" font-size="14" font-weight="400">Explore 15 curated subjects, submit your judgment, and uncover what truly guides your aesthetic perception.</text>
    </g>

    <g id="Carousel-5-Cards" transform="translate(150, 310)">
        <g id="Card-1" transform="translate(0, 40)">
            <rect width="210" height="270" rx="18" fill="#1A1A1A" stroke="#000" stroke-width="1"/>
            <rect x="14" y="16" width="105" height="24" rx="12" fill="#222222" stroke="rgba(255,255,255,0.2)"/>
            <text x="66" y="32" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="9" font-weight="700">15-ROUND TEST</text>
            <text x="16" y="195" fill="#FFF" font-family="Poppins, sans-serif" font-size="16" font-weight="700">START THE QUIZ</text>
            <text x="16" y="215" fill="rgba(255,255,255,0.8)" font-family="Poppins, sans-serif" font-size="11">15 Subjects • Human or AI?</text>
            <rect x="16" y="228" width="95" height="26" rx="13" fill="#FFF"/>
            <text x="63" y="245" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="10" font-weight="700">Start Test →</text>
        </g>
        <g id="Card-2" transform="translate(230, 20)">
            <rect width="215" height="290" rx="18" fill="#232323" stroke="#000" stroke-width="1"/>
            <rect x="14" y="16" width="112" height="24" rx="12" fill="#2A2A2A" stroke="rgba(255,255,255,0.2)"/>
            <text x="70" y="32" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="9" font-weight="700">FULL CATALOGUE</text>
            <text x="16" y="210" fill="#FFF" font-family="Poppins, sans-serif" font-size="17" font-weight="700">IMAGE ARCHIVE</text>
            <text x="16" y="232" fill="rgba(255,255,255,0.8)" font-family="Poppins, sans-serif" font-size="11">Browse all 15 subjects</text>
            <rect x="16" y="246" width="105" height="26" rx="13" fill="#FFF"/>
            <text x="68" y="263" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="10" font-weight="700">Open Library →</text>
        </g>
        <g id="Card-3-Center" transform="translate(465, 0)">
            <rect width="230" height="320" rx="20" fill="#0D1117" stroke="#2A4365" stroke-width="2"/>
            <rect x="16" y="18" width="130" height="26" rx="13" fill="#161B22" stroke="rgba(255,255,255,0.25)"/>
            <text x="81" y="35" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="9.5" font-weight="700">PERCEPTION MATRIX</text>
            <text x="18" y="235" fill="#FFF" font-family="Poppins, sans-serif" font-size="20" font-weight="800">RESULTS &amp; STATS</text>
            <text x="18" y="258" fill="rgba(255,255,255,0.85)" font-family="Poppins, sans-serif" font-size="12">Accuracy • Bias • Visual Cues</text>
            <rect x="18" y="272" width="115" height="30" rx="15" fill="#FFF"/>
            <text x="75" y="291" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="11" font-weight="700">View Stats →</text>
        </g>
        <g id="Card-4" transform="translate(715, 20)">
            <rect width="215" height="290" rx="18" fill="#1F1F1F" stroke="#000" stroke-width="1"/>
            <rect x="14" y="16" width="118" height="24" rx="12" fill="#2A2A2A" stroke="rgba(255,255,255,0.2)"/>
            <text x="73" y="32" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="9" font-weight="700">RESEARCH STUDY</text>
            <text x="16" y="210" fill="#FFF" font-family="Poppins, sans-serif" font-size="17" font-weight="700">ABOUT THE STUDY</text>
            <text x="16" y="232" fill="rgba(255,255,255,0.8)" font-family="Poppins, sans-serif" font-size="11">Aesthetic value &amp; perception</text>
            <rect x="16" y="246" width="105" height="26" rx="13" fill="#FFF"/>
            <text x="68" y="263" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="10" font-weight="700">Read Study →</text>
        </g>
        <g id="Card-5" transform="translate(950, 40)">
            <rect width="210" height="270" rx="18" fill="#1A1A1A" stroke="#000" stroke-width="1"/>
            <rect x="14" y="16" width="130" height="24" rx="12" fill="#222222" stroke="rgba(255,255,255,0.2)"/>
            <text x="79" y="32" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="9" font-weight="700">COMMUNITY &amp; INQUIRY</text>
            <text x="16" y="195" fill="#FFF" font-family="Poppins, sans-serif" font-size="16" font-weight="700">GET IN TOUCH</text>
            <text x="16" y="215" fill="rgba(255,255,255,0.8)" font-family="Poppins, sans-serif" font-size="11">Feedback &amp; research inquiry</text>
            <rect x="16" y="228" width="105" height="26" rx="13" fill="#FFF"/>
            <text x="68" y="245" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="10" font-weight="700">Contact Us →</text>
        </g>
    </g>

    <text x="720" y="730" text-anchor="middle" fill="#999" font-family="Poppins, sans-serif" font-size="11" font-weight="500" letter-spacing="1">DRAG TO ROTATE 3D ARCHIVE  •  CLICK ANY CARD TO EXPLORE</text>
    {create_footer()}
</svg>'''
    with open('public/figma-export/01_landing_home.svg', 'w') as f:
        f.write(svg)

# 2. QUIZ SCREEN
def gen_quiz():
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1200" width="1440" height="1200" fill="none">
    <rect width="1440" height="1200" fill="#F5F4EF"/>
    {create_header("QUIZ")}

    <g id="Quiz-Container" transform="translate(300, 95)">
        <!-- Progress -->
        <text x="0" y="22" fill="#2A4365" font-family="Poppins, sans-serif" font-size="13" font-weight="700" letter-spacing="1.5">ROUND 1 OF 15</text>
        <rect x="740" y="6" width="100" height="24" rx="12" fill="#ECEBE6"/>
        <text x="790" y="22" text-anchor="middle" fill="#333" font-family="Poppins, sans-serif" font-size="10.5" font-weight="700">BEGINNER</text>
        <line x1="0" y1="42" x2="840" y2="42" stroke="#D9D9D4"/>

        <!-- Title -->
        <text x="420" y="85" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="24" font-weight="700">WILDLIFE PHOTOGRAPHY — FOX</text>

        <!-- Main Image -->
        <g id="Subject-Image" transform="translate(30, 110)">
            <rect width="780" height="440" rx="20" fill="#1C1C1C" stroke="#D9D9D4"/>
            <text x="390" y="230" text-anchor="middle" fill="#888" font-family="Poppins, sans-serif" font-size="15">[ High-Resolution Subject Photography: Fox ]</text>
            <rect x="650" y="390" width="115" height="34" rx="17" fill="rgba(17,17,17,0.8)" stroke="rgba(255,255,255,0.2)"/>
            <text x="707" y="412" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="11" font-weight="600">🔍 Inspect</text>
        </g>

        <!-- Outcome Banner -->
        <g id="Outcome-Banner" transform="translate(30, 575)">
            <rect width="780" height="52" rx="14" fill="#10B981" fill-opacity="0.12" stroke="#10B981" stroke-opacity="0.35"/>
            <text x="24" y="32" fill="#065F46" font-family="Poppins, sans-serif" font-size="14" font-weight="800">CORRECT DECISION!</text>
            <rect x="640" y="14" width="116" height="25" rx="12.5" fill="#10B981"/>
            <text x="698" y="30" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="10.5" font-weight="700">HUMAN MADE</text>
        </g>

        <!-- Explanation Card -->
        <g id="Explanation" transform="translate(30, 645)">
            <rect width="780" height="120" rx="16" fill="#FFF" stroke="#D9D9D4"/>
            <text x="24" y="32" fill="#222" font-family="Poppins, sans-serif" font-size="13">Natural optical depth of field cleanly separates the fox from the dark woodland understory.</text>
            <text x="24" y="54" fill="#222" font-family="Poppins, sans-serif" font-size="13">Fine fur whiskers, grounded soil texture, and authentic optical vignetting show genuine lens physics.</text>
            <line x1="24" y1="74" x2="756" y2="74" stroke="#F0EFEA"/>
            <text x="24" y="98" fill="#777" font-family="Poppins, sans-serif" font-size="12"><tspan font-weight="600" fill="#333">Production Context:</tspan> Photographed on high-speed telephoto lens in natural British woodland.</text>
        </g>

        <!-- Factors Checklist -->
        <g id="Factors" transform="translate(30, 785)">
            <rect width="780" height="96" rx="16" fill="#FFF" stroke="#D9D9D4"/>
            <text x="24" y="28" fill="#777" font-family="Poppins, sans-serif" font-size="10.5" font-weight="700">WHAT INFLUENCED YOUR DECISION?</text>
            <g transform="translate(24, 42)">
                <rect x="0" width="120" height="32" rx="16" fill="#111"/>
                <text x="60" y="20" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="11" font-weight="600">Visual Quality</text>
                <rect x="130" width="100" height="32" rx="16" fill="#111"/>
                <text x="180" y="20" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="11" font-weight="600">Authenticity</text>
                <rect x="240" width="90" height="32" rx="16" fill="#FFF" stroke="#D9D9D4"/>
                <text x="285" y="20" text-anchor="middle" fill="#555" font-family="Poppins, sans-serif" font-size="11" font-weight="600">Originality</text>
                <rect x="340" width="70" height="32" rx="16" fill="#FFF" stroke="#D9D9D4"/>
                <text x="375" y="20" text-anchor="middle" fill="#555" font-family="Poppins, sans-serif" font-size="11" font-weight="600">Effort</text>
                <rect x="420" width="70" height="32" rx="16" fill="#FFF" stroke="#D9D9D4"/>
                <text x="455" y="20" text-anchor="middle" fill="#555" font-family="Poppins, sans-serif" font-size="11" font-weight="600">Style</text>
                <rect x="500" width="95" height="32" rx="16" fill="#FFF" stroke="#D9D9D4"/>
                <text x="547" y="20" text-anchor="middle" fill="#555" font-family="Poppins, sans-serif" font-size="11" font-weight="600">Familiarity</text>
            </g>
        </g>

        <!-- Next Button -->
        <rect x="30" y="900" width="780" height="52" rx="14" fill="#111"/>
        <text x="420" y="932" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="13" font-weight="700">NEXT SUBJECT →</text>
    </g>

    {create_footer(1120)}
</svg>'''
    with open('public/figma-export/02_the_test_quiz.svg', 'w') as f:
        f.write(svg)

# 3. RESULTS SCREEN WITH ROUND-BY-ROUND BREAKDOWN (FROM USER'S ZIP)
def gen_results():
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1460" width="1440" height="1460" fill="none">
    <rect width="1440" height="1460" fill="#F5F4EF"/>
    {create_header("HOME")}

    <g id="Results" transform="translate(260, 95)">
        <text x="0" y="20" fill="#2A4365" font-family="Poppins, sans-serif" font-size="11" font-weight="700" letter-spacing="1.5">PERCEPTION MATRIX &amp; ANALYTICS</text>
        <text x="0" y="55" fill="#111" font-family="Poppins, sans-serif" font-size="34" font-weight="800">YOUR PERFORMANCE SUMMARY</text>
        <line x1="0" y1="75" x2="920" y2="75" stroke="#D9D9D4"/>

        <!-- Score Hero -->
        <g transform="translate(0, 95)">
            <rect width="920" height="160" rx="20" fill="#FFF" stroke="#D9D9D4"/>
            <text x="460" y="70" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="64" font-weight="800">80%</text>
            <text x="460" y="102" text-anchor="middle" fill="#2A4365" font-family="Poppins, sans-serif" font-size="12" font-weight="700">OVERALL ACCURACY SCORE</text>
            <text x="460" y="128" text-anchor="middle" fill="#777" font-family="Poppins, sans-serif" font-size="14">12 of 15 subjects correctly identified</text>
        </g>

        <!-- Tier & Bias Grid -->
        <g transform="translate(0, 280)">
            <rect width="445" height="240" rx="18" fill="#FFF" stroke="#D9D9D4"/>
            <text x="24" y="32" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700">ACCURACY BY COMPLEXITY TIER</text>
            <text x="24" y="75" fill="#333" font-family="Poppins, sans-serif" font-size="12" font-weight="600">Beginner Tier</text>
            <text x="421" y="75" text-anchor="end" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700">100% (5/5)</text>
            <rect x="24" y="85" width="397" height="7" rx="3.5" fill="#111"/>
            <text x="24" y="130" fill="#333" font-family="Poppins, sans-serif" font-size="12" font-weight="600">Intermediate Tier</text>
            <text x="421" y="130" text-anchor="end" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700">80% (4/5)</text>
            <rect x="24" y="140" width="318" height="7" rx="3.5" fill="#111"/>
            <text x="24" y="185" fill="#333" font-family="Poppins, sans-serif" font-size="12" font-weight="600">Advanced Tier</text>
            <text x="421" y="185" text-anchor="end" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700">60% (3/5)</text>
            <rect x="24" y="195" width="238" height="7" rx="3.5" fill="#111"/>

            <!-- Right: Bias -->
            <g transform="translate(475, 0)">
                <rect width="445" height="240" rx="18" fill="#FFF" stroke="#D9D9D4"/>
                <text x="24" y="32" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700">AUTHORSHIP PERCEPTION BIAS</text>
                <text x="24" y="75" fill="#333" font-family="Poppins, sans-serif" font-size="12" font-weight="600">Human Craft Recognition</text>
                <text x="421" y="75" text-anchor="end" fill="#10B981" font-family="Poppins, sans-serif" font-size="12" font-weight="700">83%</text>
                <rect x="24" y="85" width="330" height="7" rx="3.5" fill="#10B981"/>
                <text x="24" y="130" fill="#333" font-family="Poppins, sans-serif" font-size="12" font-weight="600">AI Synthesis Detection</text>
                <text x="421" y="130" text-anchor="end" fill="#3B82F6" font-family="Poppins, sans-serif" font-size="12" font-weight="700">78%</text>
                <rect x="24" y="140" width="310" height="7" rx="3.5" fill="#3B82F6"/>
                <rect x="24" y="170" width="397" height="52" rx="10" fill="#FAF9F6" stroke="#ECEBE6"/>
                <text x="36" y="194" fill="#444" font-family="Poppins, sans-serif" font-size="11">Strong discernment of organic optical vignetting and natural falloff.</text>
            </g>
        </g>

        <!-- Round-By-Round Breakdown (From Zip File) -->
        <g transform="translate(0, 545)">
            <rect width="920" height="340" rx="18" fill="#FFF" stroke="#D9D9D4"/>
            <text x="24" y="32" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700">ROUND-BY-ROUND BREAKDOWN (ALL 15 SUBJECTS)</text>
            <line x1="24" y1="46" x2="896" y2="46" stroke="#F0EFEA"/>

            <!-- 15 Rounds Grid Mock -->
            <g transform="translate(24, 60)">
                <!-- Row 1 -->
                <rect x="0" y="0" width="280" height="72" rx="10" fill="#F5F4EF" stroke="#D9D9D4"/>
                <text x="12" y="24" fill="#777" font-family="Poppins, sans-serif" font-size="10">ROUND 1 • FOX</text>
                <text x="268" y="24" text-anchor="end" fill="#10B981" font-family="Poppins, sans-serif" font-size="10" font-weight="700">CORRECT</text>
                <text x="12" y="44" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="600">HUMAN MADE</text>
                <text x="12" y="60" fill="#777" font-family="Poppins, sans-serif" font-size="10">Your guess: Human</text>

                <rect x="295" y="0" width="280" height="72" rx="10" fill="#F5F4EF" stroke="#D9D9D4"/>
                <text x="307" y="24" fill="#777" font-family="Poppins, sans-serif" font-size="10">ROUND 2 • PANDA</text>
                <text x="563" y="24" text-anchor="end" fill="#10B981" font-family="Poppins, sans-serif" font-size="10" font-weight="700">CORRECT</text>
                <text x="307" y="44" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="600">AI GENERATED</text>
                <text x="307" y="60" fill="#777" font-family="Poppins, sans-serif" font-size="10">Your guess: AI</text>

                <rect x="590" y="0" width="280" height="72" rx="10" fill="#F5F4EF" stroke="#D9D9D4"/>
                <text x="602" y="24" fill="#777" font-family="Poppins, sans-serif" font-size="10">ROUND 3 • AI PORTRAIT</text>
                <text x="858" y="24" text-anchor="end" fill="#C5221F" font-family="Poppins, sans-serif" font-size="10" font-weight="700">MISSED</text>
                <text x="602" y="44" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="600">AI GENERATED</text>
                <text x="602" y="60" fill="#777" font-family="Poppins, sans-serif" font-size="10">Your guess: Human</text>

                <!-- Row 2 -->
                <rect x="0" y="85" width="280" height="72" rx="10" fill="#F5F4EF" stroke="#D9D9D4"/>
                <text x="12" y="109" fill="#777" font-family="Poppins, sans-serif" font-size="10">ROUND 4 • HUMAN PORTRAIT</text>
                <text x="268" y="109" text-anchor="end" fill="#10B981" font-family="Poppins, sans-serif" font-size="10" font-weight="700">CORRECT</text>
                <text x="12" y="129" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="600">HUMAN MADE</text>
                <text x="12" y="145" fill="#777" font-family="Poppins, sans-serif" font-size="10">Your guess: Human</text>

                <rect x="295" y="85" width="280" height="72" rx="10" fill="#F5F4EF" stroke="#D9D9D4"/>
                <text x="307" y="109" fill="#777" font-family="Poppins, sans-serif" font-size="10">ROUND 5 • STILL LIFE</text>
                <text x="563" y="109" text-anchor="end" fill="#10B981" font-family="Poppins, sans-serif" font-size="10" font-weight="700">CORRECT</text>
                <text x="307" y="129" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="600">AI GENERATED</text>
                <text x="307" y="145" fill="#777" font-family="Poppins, sans-serif" font-size="10">Your guess: AI</text>

                <rect x="590" y="85" width="280" height="72" rx="10" fill="#F5F4EF" stroke="#D9D9D4"/>
                <text x="602" y="109" fill="#777" font-family="Poppins, sans-serif" font-size="10">ROUND 6 • OIL PAINTING</text>
                <text x="858" y="109" text-anchor="end" fill="#10B981" font-family="Poppins, sans-serif" font-size="10" font-weight="700">CORRECT</text>
                <text x="602" y="129" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="600">HUMAN MADE</text>
                <text x="602" y="145" fill="#777" font-family="Poppins, sans-serif" font-size="10">Your guess: Human</text>

                <!-- More indicator -->
                <rect x="0" y="170" width="870" height="85" rx="10" fill="#FAF9F6" stroke="#ECEBE6"/>
                <text x="435" y="205" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="600">Rounds 7 through 15: Lake, Architecture, Lions, Perfume, Car, Denim, Cat</text>
                <text x="435" y="230" text-anchor="middle" fill="#777" font-family="Poppins, sans-serif" font-size="11">Intermediate &amp; Advanced Tiers • Full Results Logged</text>
            </g>
        </g>

        <!-- Quote Card -->
        <g transform="translate(0, 910)">
            <rect width="920" height="140" rx="18" fill="#111"/>
            <text x="28" y="32" fill="rgba(255,255,255,0.5)" font-family="Poppins, sans-serif" font-size="10.5" font-weight="700">EXPERIMENTAL SUMMARY</text>
            <text x="28" y="68" fill="#FFF" font-family="Newsreader, serif" font-style="italic" font-size="22">“Sometimes we respond to the work before we know who made it.”</text>
            <text x="28" y="102" fill="rgba(255,255,255,0.7)" font-family="Poppins, sans-serif" font-size="12">This experiment explores how authorship, visual quality, micro-details, texture grain, and perceived effort shape audience response.</text>
        </g>

        <!-- Buttons -->
        <g transform="translate(210, 1075)">
            <rect width="230" height="48" rx="24" fill="#111"/>
            <text x="115" y="29" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="12" font-weight="700">RETAKE 15-ROUND TEST ↺</text>
            <rect x="250" width="240" height="48" rx="24" fill="#FFF" stroke="#D9D9D4"/>
            <text x="370" y="29" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700">BROWSE IMAGE LIBRARY ↗</text>
        </g>
    </g>

    {create_footer(1380)}
</svg>'''
    with open('public/figma-export/04_results_stats.svg', 'w') as f:
        f.write(svg)

# 4. ARCHIVE SCREEN
def gen_archive():
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 980" width="1440" height="980" fill="none">
    <rect width="1440" height="980" fill="#F5F4EF"/>
    {create_header("ARCHIVE")}

    <!-- 3D Semi-Circle Arch -->
    <g id="Arch-Cards" transform="translate(720, 480)">
        <!-- Center Focus Card -->
        <g id="Active-Card" transform="translate(-160, -210)">
            <rect width="320" height="420" rx="20" fill="#FFF" stroke="#D9D9D4" filter="drop-shadow(0 25px 50px rgba(0,0,0,0.18))"/>
            <rect x="8" y="8" width="304" height="404" rx="14" fill="#1C1C1C"/>
            <text x="160" y="190" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="14" font-weight="700">[ RED FOX • BRITISH WOODLAND ]</text>
            <text x="160" y="215" text-anchor="middle" fill="#AAA" font-family="Poppins, sans-serif" font-size="11">Click Card to Flip 3D Analysis ↺</text>
            <rect x="95" y="360" width="130" height="28" rx="14" fill="#10B981"/>
            <text x="160" y="378" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="10.5" font-weight="700">HUMAN MADE</text>
        </g>
        <g transform="translate(-460, -180) rotate(12)">
            <rect width="250" height="340" rx="16" fill="#1E1E1E" stroke="#CCC" opacity="0.85"/>
            <text x="125" y="170" text-anchor="middle" fill="#AAA" font-family="Poppins, sans-serif" font-size="12">[ GIANT PANDA • AI ]</text>
        </g>
        <g transform="translate(240, -180) rotate(-12)">
            <rect width="250" height="340" rx="16" fill="#1E1E1E" stroke="#CCC" opacity="0.85"/>
            <text x="125" y="170" text-anchor="middle" fill="#AAA" font-family="Poppins, sans-serif" font-size="12">[ HUMAN PORTRAIT ]</text>
        </g>
    </g>

    <g transform="translate(720, 830)" text-anchor="middle">
        <text y="0" fill="#777" font-family="Poppins, sans-serif" font-size="12" font-weight="600" letter-spacing="1">WILDLIFE PHOTOGRAPHY — FOX</text>
        <g transform="translate(-140, 16)">
            <rect width="280" height="38" rx="19" fill="#FFF" stroke="rgba(0,0,0,0.15)"/>
            <circle cx="22" cy="19" r="4" fill="#10B981"/>
            <text x="145" y="24" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="11" font-weight="700">CLICK CARD TO ZOOM &amp; INSPECT</text>
        </g>
    </g>
    {create_footer(910)}
</svg>'''
    with open('public/figma-export/03_image_library_archive.svg', 'w') as f:
        f.write(svg)

# 5. ABOUT SCREEN (WITH INFINITE SPIRAL - EXACTLY FROM USER'S ZIP FILE)
def gen_about():
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 980" width="1440" height="980" fill="none">
    <rect width="1440" height="980" fill="#F5F4EF"/>
    {create_header("ABOUT")}

    <!-- ABOUT SCREEN (INFINITE SPIRAL ON LEFT + TEXT CONTENT ON RIGHT) -->
    <g id="About-Layout" transform="translate(150, 110)">
        
        <!-- LEFT: INFINITE SPIRAL 3D COLUMN -->
        <g id="InfiniteSpiral-Column" transform="translate(0, 0)">
            <!-- Outer Spiral Container Track -->
            <rect width="380" height="740" rx="20" fill="#ECEBE6" fill-opacity="0.5" stroke="#D9D9D4"/>
            <text x="190" y="35" text-anchor="middle" fill="#777" font-family="Poppins, sans-serif" font-size="11" font-weight="600" letter-spacing="1">INFINITE SPIRAL CYLINDER</text>

            <!-- Card Stack along Spiral -->
            <g transform="translate(190, 370)">
                <!-- Top Card -->
                <g transform="translate(-60, -220) rotate(-14) scale(0.85)">
                    <rect width="120" height="120" rx="14" fill="#222" stroke="#FFF" stroke-width="2"/>
                    <text x="60" y="65" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="11">Desert Light</text>
                </g>
                <!-- Upper Card -->
                <g transform="translate(20, -140) rotate(10) scale(0.95)">
                    <rect width="120" height="120" rx="14" fill="#2E2E2E" stroke="#FFF" stroke-width="2"/>
                    <text x="60" y="65" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="11">Green Meadow</text>
                </g>
                <!-- Center Zoom Focus Card -->
                <g transform="translate(-70, -40) scale(1.2)">
                    <rect width="120" height="120" rx="14" fill="#111" stroke="#2A4365" stroke-width="3" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.25))"/>
                    <text x="60" y="65" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="12" font-weight="700">Mountain Lake</text>
                </g>
                <!-- Lower Card -->
                <g transform="translate(30, 80) rotate(-8) scale(1.0)">
                    <rect width="120" height="120" rx="14" fill="#252525" stroke="#FFF" stroke-width="2"/>
                    <text x="60" y="65" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="11">Forest Path</text>
                </g>
                <!-- Bottom Card -->
                <g transform="translate(-50, 190) rotate(12) scale(0.85)">
                    <rect width="120" height="120" rx="14" fill="#1C1C1C" stroke="#FFF" stroke-width="2"/>
                    <text x="60" y="65" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="11">Rocky Summit</text>
                </g>
            </g>
            <text x="190" y="715" text-anchor="middle" fill="#999" font-family="Poppins, sans-serif" font-size="10">Auto-Rotating 3D Vertical Cylinder</text>
        </g>

        <!-- RIGHT: EDITORIAL HEADLINE & PARAGRAPH (FROM USER'S ZIP) -->
        <g id="Editorial-Content" transform="translate(430, 80)">
            <text x="0" y="0" fill="#777777" font-family="Poppins, sans-serif" font-size="11.5" font-weight="600" letter-spacing="2">ABOUT THE EXPERIMENT</text>
            
            <!-- 3-Line Heading -->
            <text x="0" y="50" fill="#111111" font-family="Poppins, sans-serif" font-size="34" font-weight="800" line-height="1.2">From Human-Made to AI-Generated:</text>
            <text x="0" y="92" fill="#111111" font-family="Poppins, sans-serif" font-size="34" font-weight="800">Exploring How Creative Content</text>
            <text x="0" y="134" fill="#111111" font-family="Poppins, sans-serif" font-size="34" font-weight="800">Influences Audience Perception.</text>

            <!-- Combined Paragraph -->
            <g transform="translate(0, 180)">
                <text x="0" y="0" fill="#444" font-family="Poppins, sans-serif" font-size="14.5" line-height="1.7">
                    <tspan x="0" dy="0">In an era where machine synthesis achieves photorealistic precision,</tspan>
                    <tspan x="0" dy="28">this experiment was designed to investigate whether human audiences</tspan>
                    <tspan x="0" dy="28">can intuitively discern physical craftsmanship from generative algorithms</tspan>
                    <tspan x="0" dy="28">when all creator metadata, prompts, and provenance tags are stripped away.</tspan>
                    <tspan x="0" dy="38">Through 15 matched subjects spanning beginner wildlife photography,</tspan>
                    <tspan x="0" dy="28">intermediate fine-art oil glazing, and advanced commercial caustics,</tspan>
                    <tspan x="0" dy="28">participants uncover the subtle psychological heuristics—from perceived</tspan>
                    <tspan x="0" dy="28">effort to texture grain—that truly govern aesthetic value.</tspan>
                </text>
            </g>

            <!-- Feature Points Grid -->
            <g transform="translate(0, 430)">
                <rect x="0" y="0" width="320" height="90" rx="14" fill="#FFF" stroke="#D9D9D4"/>
                <text x="18" y="28" fill="#2A4365" font-family="Poppins, sans-serif" font-size="10.5" font-weight="700">01 / BLIND OBSERVATION</text>
                <text x="18" y="52" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="600">Zero Metadata Bias</text>
                <text x="18" y="70" fill="#777" font-family="Poppins, sans-serif" font-size="11">Evaluated purely on visual pixels.</text>

                <rect x="340" y="0" width="320" height="90" rx="14" fill="#FFF" stroke="#D9D9D4"/>
                <text x="358" y="28" fill="#2A4365" font-family="Poppins, sans-serif" font-size="10.5" font-weight="700">02 / 3 CALIBRATED TIERS</text>
                <text x="358" y="52" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="600">Beginner to Advanced</text>
                <text x="358" y="70" fill="#777" font-family="Poppins, sans-serif" font-size="11">Progressive perceptual complexity.</text>
            </g>

            <!-- CTA -->
            <g transform="translate(0, 560)">
                <rect width="220" height="48" rx="24" fill="#111"/>
                <text x="110" y="29" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="12" font-weight="700">START THE TEST →</text>
            </g>
        </g>
    </g>

    {create_footer(910)}
</svg>'''
    with open('public/figma-export/05_about_study.svg', 'w') as f:
        f.write(svg)

# 6. CONTACT SCREEN (WITH PROJECT DISCLOSURES - EXACTLY FROM USER'S ZIP FILE)
def gen_contact():
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1020" width="1440" height="1020" fill="none">
    <rect width="1440" height="1020" fill="#F5F4EF"/>
    {create_header("CONTACT")}

    <g id="Contact-Content" transform="translate(250, 95)">
        <text x="0" y="20" fill="#2A4365" font-family="Poppins, sans-serif" font-size="11" font-weight="700" letter-spacing="1.5">CONNECT &amp; FEEDBACK</text>
        <text x="0" y="55" fill="#111" font-family="Poppins, sans-serif" font-size="34" font-weight="800">CONTACT &amp; DISCUSSION</text>
        <text x="0" y="85" fill="#777" font-family="Poppins, sans-serif" font-size="13.5">Have feedback on the experiment, want to suggest new test subjects, or discuss creative research? Send a message below.</text>
        <line x1="0" y1="105" x2="940" y2="105" stroke="#D9D9D4"/>

        <g transform="translate(0, 130)">
            <!-- Left Form -->
            <g id="Form">
                <rect width="530" height="520" rx="20" fill="#FFF" stroke="#D9D9D4"/>
                <text x="28" y="42" fill="#111" font-family="Poppins, sans-serif" font-size="11" font-weight="700">NAME</text>
                <rect x="28" y="52" width="474" height="42" rx="10" fill="#F5F4EF" stroke="#D9D9D4"/>
                <text x="44" y="78" fill="#999" font-family="Poppins, sans-serif" font-size="13">Your full name</text>

                <text x="28" y="122" fill="#111" font-family="Poppins, sans-serif" font-size="11" font-weight="700">EMAIL</text>
                <rect x="28" y="132" width="474" height="42" rx="10" fill="#F5F4EF" stroke="#D9D9D4"/>
                <text x="44" y="158" fill="#999" font-family="Poppins, sans-serif" font-size="13">name@domain.com</text>

                <text x="28" y="202" fill="#111" font-family="Poppins, sans-serif" font-size="11" font-weight="700">SUBJECT</text>
                <rect x="28" y="212" width="474" height="42" rx="10" fill="#F5F4EF" stroke="#D9D9D4"/>
                <text x="44" y="238" fill="#111" font-family="Poppins, sans-serif" font-size="13">General Inquiry</text>

                <text x="28" y="282" fill="#111" font-family="Poppins, sans-serif" font-size="11" font-weight="700">MESSAGE</text>
                <rect x="28" y="292" width="474" height="120" rx="10" fill="#F5F4EF" stroke="#D9D9D4"/>
                <text x="44" y="322" fill="#999" font-family="Poppins, sans-serif" font-size="13">Write your message here...</text>

                <rect x="28" y="435" width="474" height="46" rx="12" fill="#111"/>
                <text x="265" y="463" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="12.5" font-weight="700">SEND MESSAGE →</text>
            </g>

            <!-- Right Sidebar: Project Disclosures (From User's Zip) -->
            <g id="Disclosures" transform="translate(560, 0)">
                <rect width="380" height="360" rx="18" fill="#FFF" stroke="#D9D9D4"/>
                <text x="24" y="38" fill="#777" font-family="Poppins, sans-serif" font-size="11" font-weight="700" letter-spacing="1">PROJECT DISCLOSURES</text>
                
                <text x="24" y="75" fill="#111" font-family="Poppins, sans-serif" font-size="14" font-weight="700">HUMAN OR AI? Study</text>
                <text x="24" y="98" fill="#777" font-family="Poppins, sans-serif" font-size="12.5">Independent research on visual literacy, perceptual bias,</text>
                <text x="24" y="118" fill="#777" font-family="Poppins, sans-serif" font-size="12.5">and artificial intelligence in creative practice.</text>

                <line x1="24" y1="145" x2="356" y2="145" stroke="#D9D9D4"/>
                <text x="24" y="175" fill="#777" font-family="Poppins, sans-serif" font-size="11" font-weight="700">DIRECT CORRESPONDENCE</text>
                <text x="24" y="198" fill="#111" font-family="Poppins, sans-serif" font-size="13" font-weight="600">research@humanorai.experiment</text>

                <line x1="24" y1="225" x2="356" y2="225" stroke="#D9D9D4"/>
                <text x="24" y="255" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700">DATASET INTEGRITY</text>
                <text x="24" y="278" fill="#777" font-family="Poppins, sans-serif" font-size="12.5">All human subjects are verified authentic lens and</text>
                <text x="24" y="298" fill="#777" font-family="Poppins, sans-serif" font-size="12.5">brushwork works. All AI subjects are recorded with</text>
                <text x="24" y="318" fill="#777" font-family="Poppins, sans-serif" font-size="12.5">generation parameters.</text>
            </g>
        </g>
    </g>

    {create_footer(940)}
</svg>'''
    with open('public/figma-export/06_contact_discussions.svg', 'w') as f:
        f.write(svg)

gen_home()
gen_quiz()
gen_results()
gen_archive()
gen_about()
gen_contact()
print('All 6 Figma SVGs generated!')

# Package zip
zip_target = 'public/figma-export.zip'
if os.path.exists(zip_target):
    os.remove(zip_target)
z = zipfile.ZipFile(zip_target, 'w', zipfile.ZIP_DEFLATED)
for f in sorted(os.listdir('public/figma-export')):
    if f.endswith('.svg'):
        z.write(os.path.join('public/figma-export', f), f)
z.close()
print(f'figma-export.zip created with {len(z.namelist())} SVGs ({os.path.getsize(zip_target)} bytes)')
shutil.copy2(zip_target, '.aistudio/artifacts/brain/51756b38-a750-411d-9e26-ff8b1797c3b8/figma-export.zip')
