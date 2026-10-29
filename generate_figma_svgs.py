import os

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
    <!-- NAVIGATION HEADER -->
    <g id="Header" transform="translate(0, 0)">
        <rect width="1440" height="64" fill="#F5F4EF" fill-opacity="0.95"/>
        <line x1="0" y1="64" x2="1440" y2="64" stroke="#D9D9D4" stroke-width="1"/>
        <g transform="translate(150, 0)">
            <!-- Brand Logo -->
            <text x="0" y="38" fill="#111111" font-family="Poppins, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">HUMAN <tspan font-family="Newsreader, Georgia, serif" font-style="italic" font-weight="400" fill="#777777">OR</tspan> AI?</text>
        </g>
        {links_svg}
    </g>
    '''

def create_footer():
    return '''
    <!-- FOOTER -->
    <g id="Footer" transform="translate(0, 920)">
        <line x1="150" y1="0" x2="1290" y2="0" stroke="#D9D9D4" stroke-width="1"/>
        <text x="720" y="35" text-anchor="middle" fill="#777777" font-family="Poppins, sans-serif" font-size="11" font-weight="400" letter-spacing="0.5">HUMAN OR AI? — A Visual Perception &amp; Authorship Experiment</text>
        <text x="720" y="55" text-anchor="middle" fill="#111111" font-family="Poppins, sans-serif" font-size="11" font-weight="600" letter-spacing="0.8">HOME  •  THE TEST  •  LIBRARY  •  ABOUT  •  CONTACT</text>
    </g>
    '''

# 1. HOME / LANDING PAGE
def build_home():
    header = create_header("HOME")
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1020" width="1440" height="1020" fill="none">
    <rect width="1440" height="1020" fill="#F5F4EF"/>
    {header}
    
    <!-- HERO SECTION -->
    <g id="Hero" transform="translate(720, 120)" text-anchor="middle">
        <text y="0" fill="#2A4365" font-family="Poppins, sans-serif" font-size="11" font-weight="700" letter-spacing="2">VISUAL EXPERIMENT</text>
        <text y="50" fill="#111111" font-family="Poppins, sans-serif" font-size="52" font-weight="800" letter-spacing="-1">CAN YOU TELL WHO MADE IT?</text>
        <text y="88" fill="#777777" font-family="Poppins, sans-serif" font-size="14" font-weight="400">In an era where machine synthesis rivals the human hand, can intuition still discern craft from code?</text>
        <text y="110" fill="#777777" font-family="Poppins, sans-serif" font-size="14" font-weight="400">Explore 15 curated subjects, submit your judgment, and uncover what truly guides your aesthetic perception.</text>
    </g>

    <!-- 3D CAROUSEL DESTINATIONS (5 CARDS) -->
    <g id="Carousel-Cards" transform="translate(150, 310)">
        <!-- Card 1: The Test -->
        <g id="Card-1-Quiz" transform="translate(0, 40)">
            <rect width="210" height="270" rx="18" fill="#1A1A1A" stroke="#000" stroke-width="1" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.15))"/>
            <rect x="14" y="16" width="105" height="24" rx="12" fill="#222222" stroke="rgba(255,255,255,0.2)"/>
            <text x="66" y="32" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="9" font-weight="700" letter-spacing="1">15-ROUND TEST</text>
            <text x="16" y="195" fill="#FFF" font-family="Poppins, sans-serif" font-size="16" font-weight="700">START THE QUIZ</text>
            <text x="16" y="215" fill="rgba(255,255,255,0.8)" font-family="Poppins, sans-serif" font-size="11">15 Subjects • Human or AI?</text>
            <rect x="16" y="228" width="95" height="26" rx="13" fill="#FFF"/>
            <text x="63" y="245" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="10" font-weight="700">Start Test →</text>
        </g>

        <!-- Card 2: Library -->
        <g id="Card-2-Library" transform="translate(230, 20)">
            <rect width="215" height="290" rx="18" fill="#232323" stroke="#000" stroke-width="1" filter="drop-shadow(0 18px 35px rgba(0,0,0,0.2))"/>
            <rect x="14" y="16" width="112" height="24" rx="12" fill="#2A2A2A" stroke="rgba(255,255,255,0.2)"/>
            <text x="70" y="32" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="9" font-weight="700" letter-spacing="1">FULL CATALOGUE</text>
            <text x="16" y="210" fill="#FFF" font-family="Poppins, sans-serif" font-size="17" font-weight="700">IMAGE ARCHIVE</text>
            <text x="16" y="232" fill="rgba(255,255,255,0.8)" font-family="Poppins, sans-serif" font-size="11">Browse all 15 subjects</text>
            <rect x="16" y="246" width="105" height="26" rx="13" fill="#FFF"/>
            <text x="68" y="263" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="10" font-weight="700">Open Library →</text>
        </g>

        <!-- Card 3: Active Center: Results -->
        <g id="Card-3-Results-Center" transform="translate(465, 0)">
            <rect width="230" height="320" rx="20" fill="#0D1117" stroke="#2A4365" stroke-width="2" filter="drop-shadow(0 25px 50px rgba(0,0,0,0.3))"/>
            <rect x="16" y="18" width="130" height="26" rx="13" fill="#161B22" stroke="rgba(255,255,255,0.25)"/>
            <text x="81" y="35" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="9.5" font-weight="700" letter-spacing="1">PERCEPTION MATRIX</text>
            <text x="18" y="235" fill="#FFF" font-family="Poppins, sans-serif" font-size="20" font-weight="800">RESULTS &amp; STATS</text>
            <text x="18" y="258" fill="rgba(255,255,255,0.85)" font-family="Poppins, sans-serif" font-size="12">Accuracy • Bias • Visual Cues</text>
            <rect x="18" y="272" width="115" height="30" rx="15" fill="#FFF"/>
            <text x="75" y="291" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="11" font-weight="700">View Stats →</text>
        </g>

        <!-- Card 4: About -->
        <g id="Card-4-About" transform="translate(715, 20)">
            <rect width="215" height="290" rx="18" fill="#1F1F1F" stroke="#000" stroke-width="1" filter="drop-shadow(0 18px 35px rgba(0,0,0,0.2))"/>
            <rect x="14" y="16" width="118" height="24" rx="12" fill="#2A2A2A" stroke="rgba(255,255,255,0.2)"/>
            <text x="73" y="32" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="9" font-weight="700" letter-spacing="1">RESEARCH STUDY</text>
            <text x="16" y="210" fill="#FFF" font-family="Poppins, sans-serif" font-size="17" font-weight="700">ABOUT THE STUDY</text>
            <text x="16" y="232" fill="rgba(255,255,255,0.8)" font-family="Poppins, sans-serif" font-size="11">Aesthetic value &amp; perception</text>
            <rect x="16" y="246" width="105" height="26" rx="13" fill="#FFF"/>
            <text x="68" y="263" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="10" font-weight="700">Read Study →</text>
        </g>

        <!-- Card 5: Contact -->
        <g id="Card-5-Contact" transform="translate(950, 40)">
            <rect width="210" height="270" rx="18" fill="#1A1A1A" stroke="#000" stroke-width="1" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.15))"/>
            <rect x="14" y="16" width="130" height="24" rx="12" fill="#222222" stroke="rgba(255,255,255,0.2)"/>
            <text x="79" y="32" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="9" font-weight="700" letter-spacing="1">COMMUNITY &amp; INQUIRY</text>
            <text x="16" y="195" fill="#FFF" font-family="Poppins, sans-serif" font-size="16" font-weight="700">GET IN TOUCH</text>
            <text x="16" y="215" fill="rgba(255,255,255,0.8)" font-family="Poppins, sans-serif" font-size="11">Feedback &amp; research inquiry</text>
            <rect x="16" y="228" width="105" height="26" rx="13" fill="#FFF"/>
            <text x="68" y="245" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="10" font-weight="700">Contact Us →</text>
        </g>
    </g>

    <!-- Carousel Nav Hint -->
    <g transform="translate(720, 720)" text-anchor="middle">
        <text y="0" fill="#999999" font-family="Poppins, sans-serif" font-size="11" font-weight="500" letter-spacing="1">DRAG HORIZONTALLY TO ROTATE 3D ARCHIVE  •  CLICK ANY CARD TO EXPLORE</text>
    </g>
    
    {create_footer()}
</svg>'''
    with open('figma-export/01_home_landing.svg', 'w') as f:
        f.write(svg)
    print('Generated 01_home_landing.svg')

# 2. THE TEST (QUIZ)
def build_quiz():
    header = create_header("QUIZ")
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1200" width="1440" height="1200" fill="none">
    <rect width="1440" height="1200" fill="#F5F4EF"/>
    {header}

    <!-- QUIZ CONTAINER -->
    <g id="Quiz-Content" transform="translate(270, 95)">
        <!-- Progress Tracker Bar -->
        <g id="Quiz-Tracker">
            <text x="0" y="22" fill="#2A4365" font-family="Poppins, sans-serif" font-size="13" font-weight="700" letter-spacing="1.5">ROUND 1 OF 15</text>
            <rect x="800" y="6" width="100" height="24" rx="12" fill="#ECEBE6"/>
            <text x="850" y="22" text-anchor="middle" fill="#333" font-family="Poppins, sans-serif" font-size="10.5" font-weight="700" letter-spacing="1">BEGINNER</text>
            <line x1="0" y1="42" x2="900" y2="42" stroke="#D9D9D4" stroke-width="1"/>
        </g>

        <!-- Subject Title -->
        <text x="450" y="85" text-anchor="middle" fill="#111111" font-family="Poppins, sans-serif" font-size="24" font-weight="700" letter-spacing="0.5">WILDLIFE PHOTOGRAPHY — FOX</text>

        <!-- Image Frame -->
        <g id="Image-Frame" transform="translate(60, 110)">
            <rect width="780" height="460" rx="20" fill="#1A1A1A" stroke="#D9D9D4" stroke-width="1" filter="drop-shadow(0 15px 35px rgba(0,0,0,0.12))"/>
            <!-- Inner Canvas Mock/Placeholder -->
            <rect x="8" y="8" width="764" height="444" rx="16" fill="#262626"/>
            <text x="390" y="225" text-anchor="middle" fill="#888" font-family="Poppins, sans-serif" font-size="16" font-weight="600">[ High-Resolution Subject Photography: Fox ]</text>
            <rect x="650" y="415" width="115" height="32" rx="16" fill="rgba(17,17,17,0.75)" stroke="rgba(255,255,255,0.2)"/>
            <text x="707" y="435" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="11" font-weight="600">🔍 Inspect</text>
        </g>

        <!-- Outcome Banner (Correct) -->
        <g id="Outcome-Banner" transform="translate(60, 595)">
            <rect width="780" height="52" rx="14" fill="#10B981" fill-opacity="0.12" stroke="#10B981" stroke-opacity="0.35"/>
            <text x="24" y="32" fill="#065F46" font-family="Poppins, sans-serif" font-size="14" font-weight="800" letter-spacing="1">CORRECT DECISION!</text>
            <rect x="640" y="14" width="116" height="25" rx="12.5" fill="#10B981"/>
            <text x="698" y="30" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="10.5" font-weight="700" letter-spacing="1">HUMAN MADE</text>
        </g>

        <!-- Cues Explanation Card -->
        <g id="Explanation-Card" transform="translate(60, 665)">
            <rect width="780" height="120" rx="16" fill="#FFFFFF" stroke="#D9D9D4" stroke-width="1"/>
            <text x="24" y="32" fill="#222222" font-family="Poppins, sans-serif" font-size="13" font-weight="400">Natural optical depth of field cleanly separates the fox from the dark woodland understory.</text>
            <text x="24" y="54" fill="#222222" font-family="Poppins, sans-serif" font-size="13" font-weight="400">Fine fur whiskers, grounded soil texture, and authentic optical vignetting show genuine lens physics.</text>
            <line x1="24" y1="74" x2="756" y2="74" stroke="#F0EFEA" stroke-width="1"/>
            <text x="24" y="98" fill="#777777" font-family="Poppins, sans-serif" font-size="12"><tspan font-weight="600" fill="#333">Production Context:</tspan> Photographed on high-speed telephoto lens in natural British woodland.</text>
        </g>

        <!-- Factors Checklist -->
        <g id="Factors-Section" transform="translate(60, 805)">
            <rect width="780" height="96" rx="16" fill="#FFFFFF" stroke="#D9D9D4" stroke-width="1"/>
            <text x="24" y="28" fill="#777777" font-family="Poppins, sans-serif" font-size="10.5" font-weight="700" letter-spacing="1">WHAT INFLUENCED YOUR DECISION?</text>
            <!-- Chips -->
            <g transform="translate(24, 42)">
                <rect x="0" y="0" width="120" height="32" rx="16" fill="#111111"/>
                <text x="60" y="20" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="11" font-weight="600">Visual Quality</text>

                <rect x="130" y="0" width="100" height="32" rx="16" fill="#111111"/>
                <text x="180" y="20" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="11" font-weight="600">Authenticity</text>

                <rect x="240" y="0" width="90" height="32" rx="16" fill="#FFF" stroke="#D9D9D4"/>
                <text x="285" y="20" text-anchor="middle" fill="#555" font-family="Poppins, sans-serif" font-size="11" font-weight="600">Originality</text>

                <rect x="340" y="0" width="70" height="32" rx="16" fill="#FFF" stroke="#D9D9D4"/>
                <text x="375" y="20" text-anchor="middle" fill="#555" font-family="Poppins, sans-serif" font-size="11" font-weight="600">Effort</text>

                <rect x="420" y="0" width="70" height="32" rx="16" fill="#FFF" stroke="#D9D9D4"/>
                <text x="455" y="20" text-anchor="middle" fill="#555" font-family="Poppins, sans-serif" font-size="11" font-weight="600">Style</text>

                <rect x="500" y="0" width="95" height="32" rx="16" fill="#FFF" stroke="#D9D9D4"/>
                <text x="547" y="20" text-anchor="middle" fill="#555" font-family="Poppins, sans-serif" font-size="11" font-weight="600">Familiarity</text>
            </g>
        </g>

        <!-- Next Button -->
        <g id="Next-Button" transform="translate(60, 920)">
            <rect width="780" height="52" rx="14" fill="#111111"/>
            <text x="390" y="32" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="13" font-weight="700" letter-spacing="1">NEXT SUBJECT  →</text>
        </g>
    </g>

    <!-- FOOTER -->
    <g transform="translate(0, 1100)">
        <line x1="150" y1="0" x2="1290" y2="0" stroke="#D9D9D4" stroke-width="1"/>
        <text x="720" y="35" text-anchor="middle" fill="#777777" font-family="Poppins, sans-serif" font-size="11" font-weight="400">HUMAN OR AI? — A Visual Perception &amp; Authorship Experiment</text>
    </g>
</svg>'''
    with open('figma-export/02_the_test_quiz.svg', 'w') as f:
        f.write(svg)
    print('Generated 02_the_test_quiz.svg')

# 3. IMAGE LIBRARY / ARCHIVE
def build_archive():
    header = create_header("ARCHIVE")
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 980" width="1440" height="980" fill="none">
    <rect width="1440" height="980" fill="#F5F4EF"/>
    {header}

    <!-- 3D ARCHIVE ARCH GALLERY (Figma Vector Layout) -->
    <g id="Archive-Arch" transform="translate(720, 480)">
        <!-- Center Zoom Card (Expanded Front/Back) -->
        <g id="Center-Card" transform="translate(-160, -210)">
            <rect width="320" height="420" rx="20" fill="#FFFFFF" stroke="#D9D9D4" stroke-width="1" filter="drop-shadow(0 25px 50px rgba(0,0,0,0.18))"/>
            <rect x="8" y="8" width="304" height="404" rx="14" fill="#1C1C1C"/>
            <text x="160" y="190" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="14" font-weight="700">[ RED FOX • BRITISH WOODLAND ]</text>
            <text x="160" y="215" text-anchor="middle" fill="#AAA" font-family="Poppins, sans-serif" font-size="11">Click Card to Flip 3D Analysis ↺</text>
            <rect x="95" y="360" width="130" height="28" rx="14" fill="#10B981"/>
            <text x="160" y="378" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="10.5" font-weight="700" letter-spacing="1">HUMAN MADE</text>
        </g>

        <!-- Left Arch Card 1 -->
        <g id="Left-Card-1" transform="translate(-460, -180) rotate(12)">
            <rect width="250" height="340" rx="16" fill="#1E1E1E" stroke="#CCC" stroke-width="1" opacity="0.85"/>
            <text x="125" y="170" text-anchor="middle" fill="#AAA" font-family="Poppins, sans-serif" font-size="12">[ GIANT PANDA • AI ]</text>
        </g>

        <!-- Left Arch Card 2 -->
        <g id="Left-Card-2" transform="translate(-720, -120) rotate(22)">
            <rect width="210" height="290" rx="14" fill="#252525" opacity="0.5"/>
            <text x="105" y="145" text-anchor="middle" fill="#777" font-family="Poppins, sans-serif" font-size="11">[ AI PORTRAIT ]</text>
        </g>

        <!-- Right Arch Card 1 -->
        <g id="Right-Card-1" transform="translate(240, -180) rotate(-12)">
            <rect width="250" height="340" rx="16" fill="#1E1E1E" stroke="#CCC" stroke-width="1" opacity="0.85"/>
            <text x="125" y="170" text-anchor="middle" fill="#AAA" font-family="Poppins, sans-serif" font-size="12">[ HUMAN PORTRAIT ]</text>
        </g>

        <!-- Right Arch Card 2 -->
        <g id="Right-Card-2" transform="translate(510, -120) rotate(-22)">
            <rect width="210" height="290" rx="14" fill="#252525" opacity="0.5"/>
            <text x="105" y="145" text-anchor="middle" fill="#777" font-family="Poppins, sans-serif" font-size="11">[ STILL LIFE ]</text>
        </g>
    </g>

    <!-- Bottom Archive Controls -->
    <g id="Archive-Controls" transform="translate(720, 840)" text-anchor="middle">
        <text y="0" fill="#777777" font-family="Poppins, sans-serif" font-size="12" font-weight="600" letter-spacing="1">WILDLIFE PHOTOGRAPHY — FOX</text>
        <g transform="translate(-140, 16)">
            <rect width="280" height="38" rx="19" fill="#FFFFFF" stroke="rgba(0,0,0,0.15)" filter="drop-shadow(0 4px 16px rgba(0,0,0,0.06))"/>
            <circle cx="22" cy="19" r="4" fill="#10B981"/>
            <text x="145" y="24" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="11" font-weight="700" letter-spacing="0.8">CLICK CARD TO ZOOM &amp; INSPECT</text>
        </g>
        <text y="75" fill="#888888" font-family="Poppins, sans-serif" font-size="10" font-weight="500" letter-spacing="1">CLICK ANY CARD TO ZOOM IN  •  DRAG TO ROTATE ARCHIVE</text>
    </g>
</svg>'''
    with open('figma-export/03_image_library_archive.svg', 'w') as f:
        f.write(svg)
    print('Generated 03_image_library_archive.svg')

# 4. RESULTS & STATS
def build_results():
    header = create_header("HOME")
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1260" width="1440" height="1260" fill="none">
    <rect width="1440" height="1260" fill="#F5F4EF"/>
    {header}

    <!-- RESULTS CONTENT -->
    <g id="Results-Content" transform="translate(270, 95)">
        <!-- Header -->
        <text x="0" y="20" fill="#2A4365" font-family="Poppins, sans-serif" font-size="11" font-weight="700" letter-spacing="1.5">PERCEPTION MATRIX &amp; ANALYTICS</text>
        <text x="0" y="55" fill="#111111" font-family="Poppins, sans-serif" font-size="34" font-weight="800">YOUR PERFORMANCE SUMMARY</text>
        <line x1="0" y1="75" x2="900" y2="75" stroke="#D9D9D4" stroke-width="1"/>

        <!-- Score Hero Card -->
        <g id="Score-Hero" transform="translate(0, 95)">
            <rect width="900" height="170" rx="20" fill="#FFFFFF" stroke="#D9D9D4" stroke-width="1" filter="drop-shadow(0 4px 18px rgba(0,0,0,0.04))"/>
            <text x="450" y="70" text-anchor="middle" fill="#111111" font-family="Poppins, sans-serif" font-size="64" font-weight="800">80%</text>
            <text x="450" y="105" text-anchor="middle" fill="#2A4365" font-family="Poppins, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">OVERALL ACCURACY SCORE</text>
            <text x="450" y="132" text-anchor="middle" fill="#777777" font-family="Poppins, sans-serif" font-size="14">12 of 15 subjects correctly identified</text>
        </g>

        <!-- Two Column Grid -->
        <g transform="translate(0, 290)">
            <!-- Left Card: Tier Breakdown -->
            <g id="Tier-Breakdown">
                <rect width="435" height="260" rx="18" fill="#FFFFFF" stroke="#D9D9D4" stroke-width="1"/>
                <text x="24" y="32" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700" letter-spacing="1">ACCURACY BY COMPLEXITY TIER</text>
                <line x1="24" y1="46" x2="411" y2="46" stroke="#F0EFEA" stroke-width="1"/>

                <!-- Beginner -->
                <text x="24" y="80" fill="#333" font-family="Poppins, sans-serif" font-size="12" font-weight="600">Beginner Tier</text>
                <text x="411" y="80" text-anchor="end" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700">100% (5/5)</text>
                <rect x="24" y="90" width="387" height="7" rx="3.5" fill="#ECEBE6"/>
                <rect x="24" y="90" width="387" height="7" rx="3.5" fill="#111111"/>

                <!-- Intermediate -->
                <text x="24" y="135" fill="#333" font-family="Poppins, sans-serif" font-size="12" font-weight="600">Intermediate Tier</text>
                <text x="411" y="135" text-anchor="end" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700">80% (4/5)</text>
                <rect x="24" y="145" width="387" height="7" rx="3.5" fill="#ECEBE6"/>
                <rect x="24" y="145" width="310" height="7" rx="3.5" fill="#111111"/>

                <!-- Advanced -->
                <text x="24" y="190" fill="#333" font-family="Poppins, sans-serif" font-size="12" font-weight="600">Advanced Tier</text>
                <text x="411" y="190" text-anchor="end" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700">60% (3/5)</text>
                <rect x="24" y="200" width="387" height="7" rx="3.5" fill="#ECEBE6"/>
                <rect x="24" y="200" width="232" height="7" rx="3.5" fill="#111111"/>
            </g>

            <!-- Right Card: Perception Bias -->
            <g id="Perception-Bias" transform="translate(465, 0)">
                <rect width="435" height="260" rx="18" fill="#FFFFFF" stroke="#D9D9D4" stroke-width="1"/>
                <text x="24" y="32" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700" letter-spacing="1">AUTHORSHIP PERCEPTION BIAS</text>
                <line x1="24" y1="46" x2="411" y2="46" stroke="#F0EFEA" stroke-width="1"/>

                <!-- Human Detection -->
                <text x="24" y="80" fill="#333" font-family="Poppins, sans-serif" font-size="12" font-weight="600">Human Craft Recognition</text>
                <text x="411" y="80" text-anchor="end" fill="#10B981" font-family="Poppins, sans-serif" font-size="12" font-weight="700">83%</text>
                <rect x="24" y="90" width="387" height="7" rx="3.5" fill="#ECEBE6"/>
                <rect x="24" y="90" width="321" height="7" rx="3.5" fill="#10B981"/>

                <!-- AI Detection -->
                <text x="24" y="135" fill="#333" font-family="Poppins, sans-serif" font-size="12" font-weight="600">AI Synthesis Detection</text>
                <text x="411" y="135" text-anchor="end" fill="#3B82F6" font-family="Poppins, sans-serif" font-size="12" font-weight="700">78%</text>
                <rect x="24" y="145" width="387" height="7" rx="3.5" fill="#ECEBE6"/>
                <rect x="24" y="145" width="301" height="7" rx="3.5" fill="#3B82F6"/>

                <!-- Bias Statement -->
                <rect x="24" y="175" width="387" height="64" rx="10" fill="#FAF9F6" stroke="#ECEBE6"/>
                <text x="36" y="200" fill="#444" font-family="Poppins, sans-serif" font-size="11.5">You demonstrated strong sensitivity to human physical craft,</text>
                <text x="36" y="220" fill="#444" font-family="Poppins, sans-serif" font-size="11.5">discerning natural optical falloff with superior consistency.</text>
            </g>
        </g>

        <!-- Visual Cues Breakdown -->
        <g id="Cues-Breakdown" transform="translate(0, 575)">
            <rect width="900" height="230" rx="18" fill="#FFFFFF" stroke="#D9D9D4" stroke-width="1"/>
            <text x="24" y="32" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700" letter-spacing="1">VISUAL CUE FACTORS BREAKDOWN</text>
            <line x1="24" y1="46" x2="876" y2="46" stroke="#F0EFEA" stroke-width="1"/>

            <!-- Factors Rows -->
            <g transform="translate(24, 65)">
                <text x="0" y="0" fill="#333" font-family="Poppins, sans-serif" font-size="11.5" font-weight="600">Visual Quality</text>
                <text x="852" y="0" text-anchor="end" fill="#777" font-family="Poppins, sans-serif" font-size="10.5">11 selections</text>
                <rect x="0" y="8" width="852" height="6" rx="3" fill="#ECEBE6"/>
                <rect x="0" y="8" width="780" height="6" rx="3" fill="#2A4365"/>

                <text x="0" y="40" fill="#333" font-family="Poppins, sans-serif" font-size="11.5" font-weight="600">Authenticity</text>
                <text x="852" y="40" text-anchor="end" fill="#777" font-family="Poppins, sans-serif" font-size="10.5">9 selections</text>
                <rect x="0" y="48" width="852" height="6" rx="3" fill="#ECEBE6"/>
                <rect x="0" y="48" width="640" height="6" rx="3" fill="#2A4365"/>

                <text x="0" y="80" fill="#333" font-family="Poppins, sans-serif" font-size="11.5" font-weight="600">Effort &amp; Craft</text>
                <text x="852" y="80" text-anchor="end" fill="#777" font-family="Poppins, sans-serif" font-size="10.5">8 selections</text>
                <rect x="0" y="88" width="852" height="6" rx="3" fill="#ECEBE6"/>
                <rect x="0" y="88" width="570" height="6" rx="3" fill="#2A4365"/>

                <text x="0" y="120" fill="#333" font-family="Poppins, sans-serif" font-size="11.5" font-weight="600">Micro-Detail &amp; Texture</text>
                <text x="852" y="120" text-anchor="end" fill="#777" font-family="Poppins, sans-serif" font-size="10.5">7 selections</text>
                <rect x="0" y="128" width="852" height="6" rx="3" fill="#ECEBE6"/>
                <rect x="0" y="128" width="500" height="6" rx="3" fill="#2A4365"/>
            </g>
        </g>

        <!-- Action Buttons -->
        <g id="Action-Buttons" transform="translate(0, 835)">
            <rect x="220" y="0" width="200" height="46" rx="23" fill="#111111"/>
            <text x="320" y="28" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="12" font-weight="700" letter-spacing="1">RETAKE THE TEST ↺</text>

            <rect x="440" y="0" width="220" height="46" rx="23" fill="#FFFFFF" stroke="#D9D9D4"/>
            <text x="550" y="28" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700" letter-spacing="1">OPEN IMAGE LIBRARY ↗</text>
        </g>
    </g>

    <!-- FOOTER -->
    <g transform="translate(0, 1150)">
        <line x1="150" y1="0" x2="1290" y2="0" stroke="#D9D9D4" stroke-width="1"/>
        <text x="720" y="35" text-anchor="middle" fill="#777777" font-family="Poppins, sans-serif" font-size="11" font-weight="400">HUMAN OR AI? — A Visual Perception &amp; Authorship Experiment</text>
    </g>
</svg>'''
    with open('figma-export/04_results_stats.svg', 'w') as f:
        f.write(svg)
    print('Generated 04_results_stats.svg')

# 5. ABOUT PAGE
def build_about():
    header = create_header("ABOUT")
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1340" width="1440" height="1340" fill="none">
    <rect width="1440" height="1340" fill="#F5F4EF"/>
    {header}

    <!-- ABOUT CONTENT -->
    <g id="About-Content" transform="translate(280, 95)">
        <!-- Header -->
        <g id="About-Header">
            <circle cx="4" cy="18" r="4" fill="#10B981"/>
            <text x="16" y="22" fill="#2A4365" font-family="Poppins, sans-serif" font-size="11" font-weight="700" letter-spacing="1.5">CURATOR'S MANIFESTO &amp; STUDY DESIGN</text>
            <text x="0" y="65" fill="#111111" font-family="Poppins, sans-serif" font-size="36" font-weight="800">CAN THE EYE SENSE <tspan font-family="Newsreader, serif" font-style="italic" font-weight="400" fill="#777777">THE SOUL?</tspan></text>
            <text x="0" y="95" fill="#777777" font-family="Poppins, sans-serif" font-size="13.5">A blind perceptual inquiry into the boundary between mechanical precision and human intention.</text>
            <line x1="0" y1="115" x2="880" y2="115" stroke="#D9D9D4" stroke-width="1"/>
        </g>

        <!-- Manifesto Card -->
        <g id="Manifesto-Card" transform="translate(0, 135)">
            <rect width="880" height="150" rx="18" fill="#FFFFFF" stroke="#D9D9D4" stroke-width="1" filter="drop-shadow(0 4px 16px rgba(0,0,0,0.03))"/>
            <text x="28" y="32" fill="#2A4365" font-family="Poppins, sans-serif" font-size="11" font-weight="700" letter-spacing="1.5">THE PREMISE</text>
            <text x="28" y="68" fill="#111111" font-family="Newsreader, Georgia, serif" font-style="italic" font-size="20">When the artist's name is withheld, do you instinctively perceive human craft—</text>
            <text x="28" y="94" fill="#111111" font-family="Newsreader, Georgia, serif" font-style="italic" font-size="20">or does your brain simply respond to surface polish?</text>
            <text x="28" y="126" fill="#555555" font-family="Poppins, sans-serif" font-size="12.5">As generative diffusion models eliminate traditional rendering flaws, this experiment removes all metadata.</text>
        </g>

        <!-- Three Tiers Roadmap -->
        <g id="Three-Tiers-Roadmap" transform="translate(0, 315)">
            <text x="0" y="0" fill="#111" font-family="Poppins, sans-serif" font-size="11.5" font-weight="700" letter-spacing="1">THE THREE TIERS OF DISCERNMENT</text>
            <text x="880" y="0" text-anchor="end" fill="#777" font-family="Poppins, sans-serif" font-size="11">15 SUBJECTS TOTAL</text>

            <g transform="translate(0, 15)">
                <!-- Tier 1 Card -->
                <g id="Tier-1-Card">
                    <rect width="280" height="210" rx="16" fill="#FFFFFF" stroke="#D9D9D4" stroke-width="1"/>
                    <rect x="16" y="16" width="60" height="20" rx="10" fill="#ECEBE6"/>
                    <text x="46" y="30" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="9.5" font-weight="700">TIER 01</text>
                    <text x="264" y="30" text-anchor="end" fill="#777" font-family="Poppins, sans-serif" font-size="10">Rounds 1–5</text>
                    <text x="16" y="66" fill="#111" font-family="Poppins, sans-serif" font-size="13.5" font-weight="700">Surface &amp; Texture</text>
                    <text x="16" y="92" fill="#666" font-family="Poppins, sans-serif" font-size="11.5">Micro skin pores, organic pupil</text>
                    <text x="16" y="112" fill="#666" font-family="Poppins, sans-serif" font-size="11.5">reflections vs. synthetic</text>
                    <text x="16" y="132" fill="#666" font-family="Poppins, sans-serif" font-size="11.5">subsurface scattering.</text>
                    <line x1="16" y1="160" x2="264" y2="160" stroke="#F0EFEA"/>
                    <rect x="16" y="172" width="105" height="22" rx="6" fill="#FAF9F6" stroke="#E5E4DE"/>
                    <text x="68" y="187" text-anchor="middle" fill="#555" font-family="Poppins, sans-serif" font-size="9.5" font-weight="600">Skin Micro-Pores</text>
                    <rect x="128" y="172" width="85" height="22" rx="6" fill="#FAF9F6" stroke="#E5E4DE"/>
                    <text x="170" y="187" text-anchor="middle" fill="#555" font-family="Poppins, sans-serif" font-size="9.5" font-weight="600">Lens Vignette</text>
                </g>

                <!-- Tier 2 Card -->
                <g id="Tier-2-Card" transform="translate(300, 0)">
                    <rect width="280" height="210" rx="16" fill="#FFFFFF" stroke="#D9D9D4" stroke-width="1"/>
                    <rect x="16" y="16" width="60" height="20" rx="10" fill="#ECEBE6"/>
                    <text x="46" y="30" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="9.5" font-weight="700">TIER 02</text>
                    <text x="264" y="30" text-anchor="end" fill="#777" font-family="Poppins, sans-serif" font-size="10">Rounds 6–10</text>
                    <text x="16" y="66" fill="#111" font-family="Poppins, sans-serif" font-size="13.5" font-weight="700">The Medium &amp; Light</text>
                    <text x="16" y="92" fill="#666" font-family="Poppins, sans-serif" font-size="11.5">Authentic oil impasto strokes,</text>
                    <text x="16" y="112" fill="#666" font-family="Poppins, sans-serif" font-size="11.5">canvas weave, and twilight</text>
                    <text x="16" y="132" fill="#666" font-family="Poppins, sans-serif" font-size="11.5">Rayleigh scattering.</text>
                    <line x1="16" y1="160" x2="264" y2="160" stroke="#F0EFEA"/>
                    <rect x="16" y="172" width="85" height="22" rx="6" fill="#FAF9F6" stroke="#E5E4DE"/>
                    <text x="58" y="187" text-anchor="middle" fill="#555" font-family="Poppins, sans-serif" font-size="9.5" font-weight="600">Oil Impasto</text>
                    <rect x="108" y="172" width="125" height="22" rx="6" fill="#FAF9F6" stroke="#E5E4DE"/>
                    <text x="170" y="187" text-anchor="middle" fill="#555" font-family="Poppins, sans-serif" font-size="9.5" font-weight="600">Atmospheric Bokeh</text>
                </g>

                <!-- Tier 3 Card -->
                <g id="Tier-3-Card" transform="translate(600, 0)">
                    <rect width="280" height="210" rx="16" fill="#FFFFFF" stroke="#D9D9D4" stroke-width="1"/>
                    <rect x="16" y="16" width="60" height="20" rx="10" fill="#ECEBE6"/>
                    <text x="46" y="30" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="9.5" font-weight="700">TIER 03</text>
                    <text x="264" y="30" text-anchor="end" fill="#777" font-family="Poppins, sans-serif" font-size="10">Rounds 11–15</text>
                    <text x="16" y="66" fill="#111" font-family="Poppins, sans-serif" font-size="13.5" font-weight="700">The Convergence</text>
                    <text x="16" y="92" fill="#666" font-family="Poppins, sans-serif" font-size="11.5">Commercial glass caustics,</text>
                    <text x="16" y="112" fill="#666" font-family="Poppins, sans-serif" font-size="11.5">textile denim weaves, and wet</text>
                    <text x="16" y="132" fill="#666" font-family="Poppins, sans-serif" font-size="11.5">pavement reflections.</text>
                    <line x1="16" y1="160" x2="264" y2="160" stroke="#F0EFEA"/>
                    <rect x="16" y="172" width="95" height="22" rx="6" fill="#FAF9F6" stroke="#E5E4DE"/>
                    <text x="63" y="187" text-anchor="middle" fill="#555" font-family="Poppins, sans-serif" font-size="9.5" font-weight="600">Glass Caustics</text>
                    <rect x="118" y="172" width="95" height="22" rx="6" fill="#FAF9F6" stroke="#E5E4DE"/>
                    <text x="165" y="187" text-anchor="middle" fill="#555" font-family="Poppins, sans-serif" font-size="9.5" font-weight="600">Weave Seams</text>
                </g>
            </g>
        </g>

        <!-- Dialectic Comparison -->
        <g id="Dialectic-Card" transform="translate(0, 570)">
            <rect width="880" height="175" rx="18" fill="#FFFFFF" stroke="#D9D9D4" stroke-width="1"/>
            <text x="24" y="32" fill="#111" font-family="Poppins, sans-serif" font-size="11" font-weight="700" letter-spacing="1">THE TWO FORCES: WHAT WE ARE ACTUALLY COMPARING</text>
            <line x1="24" y1="46" x2="856" y2="46" stroke="#F0EFEA"/>

            <!-- Human Touch Box -->
            <rect x="24" y="60" width="405" height="95" rx="12" fill="#FAF9F6" stroke="#ECEBE6"/>
            <circle cx="44" cy="80" r="4" fill="#10B981"/>
            <text x="56" y="84" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700">The Human Touch</text>
            <text x="44" y="110" fill="#444" font-family="Poppins, sans-serif" font-size="11.5">Rooted in physical friction, physical resistance, and deliberate</text>
            <text x="44" y="128" fill="#444" font-family="Poppins, sans-serif" font-size="11.5">imperfection. The human eye forgives living errors.</text>

            <!-- Generative Box -->
            <rect x="451" y="60" width="405" height="95" rx="12" fill="#FAF9F6" stroke="#ECEBE6"/>
            <circle cx="471" cy="80" r="4" fill="#3B82F6"/>
            <text x="483" y="84" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700">The Generative Synthesis</text>
            <text x="471" y="110" fill="#444" font-family="Poppins, sans-serif" font-size="11.5">Rooted in statistical probability and mathematical averaging.</text>
            <text x="471" y="128" fill="#444" font-family="Poppins, sans-serif" font-size="11.5">Hyper-consistent specular curves and frictionless lighting.</text>
        </g>

        <!-- Obsidian Quote -->
        <g id="Obsidian-Quote" transform="translate(0, 770)">
            <rect width="880" height="150" rx="18" fill="#111111"/>
            <text x="28" y="32" fill="rgba(255,255,255,0.5)" font-family="Poppins, sans-serif" font-size="10.5" font-weight="700" letter-spacing="1">CORE FINDING</text>
            <text x="28" y="70" fill="#FFF" font-family="Newsreader, serif" font-style="italic" font-size="20">“When viewers know an artwork is made by a human, they search for intention.</text>
            <text x="28" y="96" fill="#FFF" font-family="Newsreader, serif" font-style="italic" font-size="20">When they believe it is generated by a computer, they search for flaws.”</text>
            <text x="28" y="132" fill="rgba(255,255,255,0.6)" font-family="Poppins, sans-serif" font-size="11">The Effort Heuristic in Aesthetic Judgment  •  EXP // 2026</text>
        </g>

        <!-- CTA Buttons -->
        <g id="About-CTAs" transform="translate(0, 950)">
            <rect x="230" y="0" width="220" height="46" rx="23" fill="#111111"/>
            <text x="340" y="28" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="12" font-weight="700" letter-spacing="1">START THE TEST →</text>

            <rect x="470" y="0" width="220" height="46" rx="23" fill="#FFFFFF" stroke="#D9D9D4"/>
            <text x="580" y="28" text-anchor="middle" fill="#111" font-family="Poppins, sans-serif" font-size="12" font-weight="700" letter-spacing="1">OPEN IMAGE LIBRARY ↗</text>
        </g>
    </g>

    <!-- FOOTER -->
    <g transform="translate(0, 1220)">
        <line x1="150" y1="0" x2="1290" y2="0" stroke="#D9D9D4" stroke-width="1"/>
        <text x="720" y="35" text-anchor="middle" fill="#777777" font-family="Poppins, sans-serif" font-size="11" font-weight="400">HUMAN OR AI? — A Visual Perception &amp; Authorship Experiment</text>
    </g>
</svg>'''
    with open('figma-export/05_about_study.svg', 'w') as f:
        f.write(svg)
    print('Generated 05_about_study.svg')

# 6. CONTACT PAGE
def build_contact():
    header = create_header("CONTACT")
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1080" width="1440" height="1080" fill="none">
    <rect width="1440" height="1080" fill="#F5F4EF"/>
    {header}

    <!-- CONTACT CONTENT -->
    <g id="Contact-Content" transform="translate(260, 95)">
        <!-- Header -->
        <text x="0" y="20" fill="#2A4365" font-family="Poppins, sans-serif" font-size="11" font-weight="700" letter-spacing="1.5">RESEARCH INQUIRY &amp; FEEDBACK</text>
        <text x="0" y="55" fill="#111111" font-family="Poppins, sans-serif" font-size="34" font-weight="800">CONNECT &amp; DISCUSS</text>
        <text x="0" y="85" fill="#777777" font-family="Poppins, sans-serif" font-size="13.5">Submit feedback, propose artworks for future research tiers, or connect with the team.</text>
        <line x1="0" y1="105" x2="920" y2="105" stroke="#D9D9D4" stroke-width="1"/>

        <!-- Grid Layout -->
        <g transform="translate(0, 130)">
            <!-- Left Form Card -->
            <g id="Contact-Form-Card">
                <rect width="540" height="560" rx="20" fill="#FFFFFF" stroke="#D9D9D4" stroke-width="1" filter="drop-shadow(0 4px 18px rgba(0,0,0,0.04))"/>
                
                <!-- Field: Name -->
                <text x="28" y="42" fill="#111" font-family="Poppins, sans-serif" font-size="11" font-weight="700" letter-spacing="1">YOUR NAME</text>
                <rect x="28" y="52" width="484" height="44" rx="10" fill="#FAF9F6" stroke="#D9D9D4"/>
                <text x="44" y="79" fill="#999" font-family="Poppins, sans-serif" font-size="13">Sarah Chen</text>

                <!-- Field: Email -->
                <text x="28" y="126" fill="#111" font-family="Poppins, sans-serif" font-size="11" font-weight="700" letter-spacing="1">EMAIL ADDRESS</text>
                <rect x="28" y="136" width="484" height="44" rx="10" fill="#FAF9F6" stroke="#D9D9D4"/>
                <text x="44" y="163" fill="#999" font-family="Poppins, sans-serif" font-size="13">sarah@example.com</text>

                <!-- Field: Subject -->
                <text x="28" y="210" fill="#111" font-family="Poppins, sans-serif" font-size="11" font-weight="700" letter-spacing="1">INQUIRY SUBJECT</text>
                <rect x="28" y="220" width="484" height="44" rx="10" fill="#FAF9F6" stroke="#D9D9D4"/>
                <text x="44" y="247" fill="#111" font-family="Poppins, sans-serif" font-size="13">General Feedback &amp; Perceptual Notes</text>
                <text x="490" y="247" fill="#666" font-family="Poppins, sans-serif" font-size="12">▼</text>

                <!-- Field: Message -->
                <text x="28" y="294" fill="#111" font-family="Poppins, sans-serif" font-size="11" font-weight="700" letter-spacing="1">MESSAGE OR FEEDBACK</text>
                <rect x="28" y="304" width="484" height="140" rx="10" fill="#FAF9F6" stroke="#D9D9D4"/>
                <text x="44" y="335" fill="#999" font-family="Poppins, sans-serif" font-size="13">Share your thoughts on the experiment or suggested visual cues...</text>

                <!-- Submit Button -->
                <rect x="28" y="475" width="484" height="48" rx="12" fill="#111111"/>
                <text x="270" y="505" text-anchor="middle" fill="#FFF" font-family="Poppins, sans-serif" font-size="12.5" font-weight="700" letter-spacing="1">SEND MESSAGE →</text>
            </g>

            <!-- Right Sidebar Info -->
            <g id="Sidebar-Cards" transform="translate(570, 0)">
                <!-- Sidebar 1 -->
                <g id="Sidebar-1">
                    <rect width="350" height="220" rx="18" fill="#FFFFFF" stroke="#D9D9D4" stroke-width="1"/>
                    <text x="24" y="38" fill="#111" font-family="Poppins, sans-serif" font-size="15" font-weight="700">Participate in Future Rounds</text>
                    <text x="24" y="70" fill="#444" font-family="Poppins, sans-serif" font-size="12.5">We are actively curating 15 additional</text>
                    <text x="24" y="92" fill="#444" font-family="Poppins, sans-serif" font-size="12.5">subjects for Tier 4 (Hyper-Photorealism).</text>
                    <text x="24" y="114" fill="#444" font-family="Poppins, sans-serif" font-size="12.5">If you are a photographer or prompt engineer</text>
                    <text x="24" y="136" fill="#444" font-family="Poppins, sans-serif" font-size="12.5">wishing to submit candidate works with known</text>
                    <text x="24" y="158" fill="#444" font-family="Poppins, sans-serif" font-size="12.5">provenance, include your raw files link.</text>
                </g>

                <!-- Sidebar 2 -->
                <g id="Sidebar-2" transform="translate(0, 250)">
                    <rect width="350" height="220" rx="18" fill="#FFFFFF" stroke="#D9D9D4" stroke-width="1"/>
                    <text x="24" y="38" fill="#111" font-family="Poppins, sans-serif" font-size="15" font-weight="700">Privacy &amp; Data Ethics</text>
                    <text x="24" y="70" fill="#444" font-family="Poppins, sans-serif" font-size="12.5">Responses collected in this experiment are</text>
                    <text x="24" y="92" fill="#444" font-family="Poppins, sans-serif" font-size="12.5">aggregated anonymously for perceptual</text>
                    <text x="24" y="114" fill="#444" font-family="Poppins, sans-serif" font-size="12.5">research into human-AI discernment</text>
                    <text x="24" y="136" fill="#444" font-family="Poppins, sans-serif" font-size="12.5">benchmarks. No personally identifiable</text>
                    <text x="24" y="158" fill="#444" font-family="Poppins, sans-serif" font-size="12.5">tracking is conducted.</text>
                </g>
            </g>
        </g>
    </g>

    <!-- FOOTER -->
    <g transform="translate(0, 960)">
        <line x1="150" y1="0" x2="1290" y2="0" stroke="#D9D9D4" stroke-width="1"/>
        <text x="720" y="35" text-anchor="middle" fill="#777777" font-family="Poppins, sans-serif" font-size="11" font-weight="400">HUMAN OR AI? — A Visual Perception &amp; Authorship Experiment</text>
    </g>
</svg>'''
    with open('figma-export/06_contact_discussion.svg', 'w') as f:
        f.write(svg)
    print('Generated 06_contact_discussion.svg')

build_home()
build_quiz()
build_archive()
build_results()
build_about()
build_contact()
print('All 6 Figma SVGs generated successfully!')
