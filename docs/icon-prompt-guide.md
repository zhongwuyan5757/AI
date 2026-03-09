# FiveSeven AI 图标生成提示词完整指南

> 版本：v1.0 | 适用平台：Midjourney v6.1 / DALL-E 3 / Flux Pro
> 色彩系统：#69EACB (青绿) / #A78BFA (紫色) / #D264B6 (粉色) / #09090b (底色)

---

## 一、总体风格定义（Master Style）

### 1.1 设计语言规范

所有图标必须遵循以下统一视觉语言：

- **风格**：扁平化线性图标 + 微妙的渐变填充，融合赛博朋克与极简 SaaS 美学
- **构图**：居中对称，图标主体占画面 60%-70%，留有呼吸空间
- **色彩**：以青绿(#69EACB)为主光源，紫色(#A78BFA)为辅助光，粉色(#D264B6)为高光点缀
- **背景**：纯净深色或透明，兼容 #09090b 至 #16161d 的暗色卡片背景
- **质感**：玻璃态微光泽，边缘带极细的渐变发光描边（0.5-1px）
- **细节度**：中低细节，适合 32px-64px 显示尺寸，避免过于复杂的结构
- **情绪**：专业、未来感、克制的科技美感，传递"AI赋能"的核心理念

### 1.2 Midjourney 主风格提示词（Master Prompt Prefix）

以下前缀应添加到每个图标提示词的开头，确保全套图标视觉一致：

```
Minimalist flat icon, dark background #09090b, clean vector style,
subtle gradient glow using cyan #69EACB to purple #A78BFA to pink #D264B6,
thin luminous outline, glass morphism micro-highlight, futuristic SaaS
aesthetic, gaming tech fusion, centered composition, icon design for
32-64px display, professional UI icon --ar 1:1 --s 250 --style raw
```

**Midjourney 推荐参数：**

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| `--ar` | `1:1` | 正方形，适合图标场景 |
| `--s` (stylize) | `200-300` | 中高风格化，保持艺术感但不失清晰度 |
| `--style` | `raw` | 减少 Midjourney 默认美化，获得更干净的图标 |
| `--chaos` | `0-15` | 低混乱度，保证可预测性和一致性 |
| `--v` | `6.1` | 使用最新版本 |
| `--no` | 见下方负面提示词 | 排除不需要的元素 |

**Midjourney 统一负面提示词：**

```
--no realistic, photographic, 3D render, text, letters, words, watermark,
complex background, gradient background, busy details, organic textures,
shadows on background, multiple objects, frame, border, mockup
```

### 1.3 DALL-E 3 主风格提示词（Master Prompt Prefix）

```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon uses a clean vector aesthetic with a subtle luminous gradient
flowing from cyan (#69EACB) through purple (#A78BFA) to pink (#D264B6).
The icon has a thin glowing outline with glass morphism micro-highlights.
The style is futuristic SaaS meets gaming tech — professional, modern,
and suitable for display at 32-64 pixels. Centered composition with
ample negative space. No text, no shadows, no 3D effects.
```

### 1.4 Flux Pro 主风格提示词（Master Prompt Prefix）

```
A single minimalist icon on a solid dark background color #09090b.
Clean vector-style flat design. The icon is rendered with a luminous
gradient that transitions from cyan #69EACB to purple #A78BFA to
pink #D264B6. Ultra-thin glowing edges. Subtle glass morphism sheen.
Futuristic technology aesthetic blended with gaming culture. The icon
is centered, simple enough for 32px display, with generous negative
space. No text. No realistic textures. No 3D rendering.
```

---

## 二、岗位图标提示词（Job Role Icons）

> 共 10 个岗位，对应 `data/jobs.json` 中的 `icon` 字段。
> 每个图标需传达岗位核心职能 + AI 赋能感。

---

### 2.1 游戏策划 (Game Planner / Game Designer)

**视觉概念：** 游戏手柄与 AI 神经网络节点的融合，传达"用 AI 驱动游戏设计"

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized game controller
silhouette with neural network connection nodes emanating from it, clean
geometric lines, subtle gradient glow from cyan #69EACB through purple
#A78BFA to pink #D264B6, thin luminous outline, glass morphism
micro-highlight, futuristic gaming tech aesthetic, centered composition,
professional UI icon --ar 1:1 --s 250 --style raw --no realistic,
photographic, 3D render, text, watermark, complex background, busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon depicts a stylized game controller silhouette with small neural
network nodes and connection lines extending from it, suggesting AI-powered
game design. The icon uses a luminous gradient from cyan (#69EACB) through
purple (#A78BFA) to pink (#D264B6). Thin glowing outline, glass morphism
sheen. Clean vector style, centered, suitable for 32-64px display.
No text, no shadows, no 3D effects.
```

---

### 2.2 平面设计师 (Graphic Designer)

**视觉概念：** 画笔或钢笔工具与 AI 光粒子的结合，传达"AI 辅助视觉创作"

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized pen tool or
digital brush with small AI sparkle particles around the tip, geometric
vector aesthetic, subtle gradient glow from cyan #69EACB through purple
#A78BFA to pink #D264B6, thin luminous outline, glass morphism
micro-highlight, futuristic SaaS design aesthetic, centered composition,
professional UI icon --ar 1:1 --s 250 --style raw --no realistic,
photographic, 3D render, text, watermark, complex background, busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon shows a stylized digital pen tool or brush with small luminous
AI sparkle particles emanating from its tip, representing AI-assisted
graphic design. The icon uses a gradient from cyan (#69EACB) through
purple (#A78BFA) to pink (#D264B6). Thin glowing outline, clean vector
style, glass morphism micro-highlights. Centered, suitable for 32-64px.
No text, no shadows, no 3D effects.
```

---

### 2.3 UI/UX 设计师 (UI/UX Designer)

**视觉概念：** 界面框架线稿与智能光标的融合，传达"AI 驱动交互设计"

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized wireframe
rectangle with a smart cursor arrow and small circular AI indicator node,
clean geometric grid lines, subtle gradient glow from cyan #69EACB through
purple #A78BFA to pink #D264B6, thin luminous outline, glass morphism
micro-highlight, futuristic interface design aesthetic, centered
composition, professional UI icon --ar 1:1 --s 250 --style raw --no
realistic, photographic, 3D render, text, watermark, complex background,
busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon depicts a stylized wireframe UI layout rectangle with a smart
cursor and a small glowing AI node, representing AI-powered UI/UX design.
Uses a luminous gradient from cyan (#69EACB) through purple (#A78BFA) to
pink (#D264B6). Thin glowing outline, clean vector aesthetic, glass
morphism sheen. Centered composition, suitable for 32-64px display.
No text, no shadows, no 3D effects.
```

---

### 2.4 视频剪辑师 (Video Editor)

**视觉概念：** 电影胶片帧与 AI 波形线的结合，传达"AI 视频创作"

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized film frame or
clapperboard silhouette with AI waveform lines running through it,
cinematic geometric aesthetic, subtle gradient glow from cyan #69EACB
through purple #A78BFA to pink #D264B6, thin luminous outline, glass
morphism micro-highlight, futuristic video production aesthetic, centered
composition, professional UI icon --ar 1:1 --s 250 --style raw --no
realistic, photographic, 3D render, text, watermark, complex background,
busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon shows a stylized film frame or clapperboard with AI-generated
waveform lines flowing through it, representing AI video editing. Uses a
luminous gradient from cyan (#69EACB) through purple (#A78BFA) to pink
(#D264B6). Thin glowing outline, clean vector style, glass morphism
micro-highlights. Centered, suitable for 32-64px display. No text, no
shadows, no 3D effects.
```

---

### 2.5 内容创作者 / 文案 (Content Creator / Writer)

**视觉概念：** 钢笔笔尖与 AI 文字流的融合，传达"AI 辅助内容创作"

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized fountain pen
nib with flowing digital text lines or data streams emanating from the
tip, literary meets technology aesthetic, subtle gradient glow from cyan
#69EACB through purple #A78BFA to pink #D264B6, thin luminous outline,
glass morphism micro-highlight, futuristic content creation aesthetic,
centered composition, professional UI icon --ar 1:1 --s 250 --style raw
--no realistic, photographic, 3D render, text, watermark, complex
background, busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon depicts a stylized pen nib with flowing digital data streams or
abstract text lines emerging from the tip, representing AI-powered content
creation and writing. Uses a luminous gradient from cyan (#69EACB) through
purple (#A78BFA) to pink (#D264B6). Thin glowing outline, clean vector
style, glass morphism sheen. Centered, suitable for 32-64px. No text,
no shadows, no 3D effects.
```

---

### 2.6 社媒运营 (Social Media Manager)

**视觉概念：** 对话气泡与社交网络节点的组合，传达"AI 社媒管理"

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized chat bubble or
speech balloon with small social network connection nodes branching
outward, digital communication aesthetic, subtle gradient glow from cyan
#69EACB through purple #A78BFA to pink #D264B6, thin luminous outline,
glass morphism micro-highlight, futuristic social media technology
aesthetic, centered composition, professional UI icon --ar 1:1 --s 250
--style raw --no realistic, photographic, 3D render, text, watermark,
complex background, busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon shows a stylized chat bubble with small network connection nodes
radiating outward, representing AI-driven social media management. Uses
a luminous gradient from cyan (#69EACB) through purple (#A78BFA) to
pink (#D264B6). Thin glowing outline, clean vector style, glass morphism
micro-highlights. Centered, suitable for 32-64px. No text, no shadows,
no 3D effects.
```

---

### 2.7 数据分析师 (Data Analyst)

**视觉概念：** 柱状图/折线图与 AI 洞察光点的结合，传达"AI 数据洞察"

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized bar chart with
an ascending trend line and small AI insight sparkle at the peak, data
visualization geometric aesthetic, subtle gradient glow from cyan #69EACB
through purple #A78BFA to pink #D264B6, thin luminous outline, glass
morphism micro-highlight, futuristic data analytics aesthetic, centered
composition, professional UI icon --ar 1:1 --s 250 --style raw --no
realistic, photographic, 3D render, text, watermark, complex background,
busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon depicts a stylized bar chart with a rising trend line and a small
glowing AI sparkle at its peak, representing AI-powered data analysis.
Uses a luminous gradient from cyan (#69EACB) through purple (#A78BFA) to
pink (#D264B6). Thin glowing outline, clean vector style, glass morphism
sheen. Centered, suitable for 32-64px. No text, no shadows, no 3D effects.
```

---

### 2.8 音效设计师 (Sound Designer)

**视觉概念：** 音波波形与 AI 频率节点的融合，传达"AI 音频创作"

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized sound waveform
or audio equalizer bars with small AI frequency nodes interspersed,
musical technology aesthetic, subtle gradient glow from cyan #69EACB
through purple #A78BFA to pink #D264B6, thin luminous outline, glass
morphism micro-highlight, futuristic audio production aesthetic, centered
composition, professional UI icon --ar 1:1 --s 250 --style raw --no
realistic, photographic, 3D render, text, watermark, complex background,
busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon shows a stylized sound waveform or audio equalizer with small
luminous AI nodes integrated into the wave pattern, representing AI sound
design. Uses a gradient from cyan (#69EACB) through purple (#A78BFA) to
pink (#D264B6). Thin glowing outline, clean vector style, glass morphism
micro-highlights. Centered, suitable for 32-64px. No text, no shadows,
no 3D effects.
```

---

### 2.9 3D 美术师 (3D Artist)

**视觉概念：** 3D 立方体线框与 AI 粒子的组合，传达"AI 3D 创作"

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized wireframe 3D
cube or low-poly geometric shape with small AI particle dots at vertices,
three-dimensional digital art aesthetic, subtle gradient glow from cyan
#69EACB through purple #A78BFA to pink #D264B6, thin luminous outline,
glass morphism micro-highlight, futuristic 3D art technology aesthetic,
centered composition, professional UI icon --ar 1:1 --s 250 --style raw
--no realistic, photographic, 3D render, text, watermark, complex
background, busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon depicts a stylized wireframe 3D cube or low-poly geometric shape
with small glowing AI dots at its vertices, representing AI-assisted 3D
art creation. Uses a gradient from cyan (#69EACB) through purple (#A78BFA)
to pink (#D264B6). Thin glowing outline, clean vector style, glass
morphism sheen. Centered, suitable for 32-64px. No text, no shadows,
no photorealistic 3D rendering.
```

---

### 2.10 市场营销 (Marketing Manager)

**视觉概念：** 扩音器/信号塔与 AI 数据脉冲的结合，传达"AI 营销增长"

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized megaphone or
broadcast signal tower with AI data pulse rings radiating outward,
marketing technology aesthetic, subtle gradient glow from cyan #69EACB
through purple #A78BFA to pink #D264B6, thin luminous outline, glass
morphism micro-highlight, futuristic martech aesthetic, centered
composition, professional UI icon --ar 1:1 --s 250 --style raw --no
realistic, photographic, 3D render, text, watermark, complex background,
busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon shows a stylized megaphone with AI-generated pulse rings or
broadcast waves radiating outward, representing AI-driven marketing. Uses
a luminous gradient from cyan (#69EACB) through purple (#A78BFA) to pink
(#D264B6). Thin glowing outline, clean vector style, glass morphism
micro-highlights. Centered, suitable for 32-64px. No text, no shadows,
no 3D effects.
```

---

## 三、教程分类图标提示词（Tutorial Category Icons）

> 共 8 个分类，对应 AI 能力的主要领域。
> 每个图标需清晰传达该 AI 能力类型。

---

### 3.1 AI 对话 (AI Chat / Conversation)

**视觉概念：** 智能对话气泡与 AI 光点

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, two stylized overlapping
chat bubbles with a small glowing AI brain dot inside one bubble,
conversational AI aesthetic, subtle gradient glow from cyan #69EACB
through purple #A78BFA to pink #D264B6, thin luminous outline, glass
morphism micro-highlight, futuristic communication technology, centered
composition, professional UI icon --ar 1:1 --s 250 --style raw --no
realistic, photographic, 3D render, text, watermark, complex background,
busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon shows two overlapping stylized chat bubbles, one containing a
small glowing AI indicator dot, representing AI conversation and chatbot
technology. Uses a luminous gradient from cyan (#69EACB) through purple
(#A78BFA) to pink (#D264B6). Thin glowing outline, clean vector style.
Centered, suitable for 32-64px. No text, no shadows, no 3D effects.
```

---

### 3.2 AI 绘图 (AI Image Generation)

**视觉概念：** 图片框与 AI 魔法笔刷

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized image frame or
canvas with a magic wand or AI brush creating pixel particles inside it,
generative art aesthetic, subtle gradient glow from cyan #69EACB through
purple #A78BFA to pink #D264B6, thin luminous outline, glass morphism
micro-highlight, futuristic AI art generation aesthetic, centered
composition, professional UI icon --ar 1:1 --s 250 --style raw --no
realistic, photographic, 3D render, text, watermark, complex background,
busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon depicts a stylized image frame with a magic wand or AI brush
generating luminous pixel particles inside it, representing AI image
generation. Uses a gradient from cyan (#69EACB) through purple (#A78BFA)
to pink (#D264B6). Thin glowing outline, clean vector style, glass
morphism sheen. Centered, suitable for 32-64px. No text, no shadows,
no 3D effects.
```

---

### 3.3 AI 视频 (AI Video Creation)

**视觉概念：** 播放按钮三角形与 AI 时间线

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized play button
triangle inside a rounded rectangle with small AI timeline markers or
motion lines, video generation aesthetic, subtle gradient glow from cyan
#69EACB through purple #A78BFA to pink #D264B6, thin luminous outline,
glass morphism micro-highlight, futuristic video AI aesthetic, centered
composition, professional UI icon --ar 1:1 --s 250 --style raw --no
realistic, photographic, 3D render, text, watermark, complex background,
busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon shows a stylized play button triangle within a rounded rectangle,
with small AI-generated motion lines or timeline markers, representing AI
video creation. Uses a luminous gradient from cyan (#69EACB) through
purple (#A78BFA) to pink (#D264B6). Thin glowing outline, clean vector
style. Centered, suitable for 32-64px. No text, no shadows, no 3D effects.
```

---

### 3.4 AI 音频 (AI Audio / Music)

**视觉概念：** 音符与 AI 声波频谱

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized musical note
combined with AI frequency spectrum bars or sine wave, audio synthesis
aesthetic, subtle gradient glow from cyan #69EACB through purple #A78BFA
to pink #D264B6, thin luminous outline, glass morphism micro-highlight,
futuristic audio AI aesthetic, centered composition, professional UI icon
--ar 1:1 --s 250 --style raw --no realistic, photographic, 3D render,
text, watermark, complex background, busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon depicts a stylized musical note merged with AI frequency spectrum
bars or a sine wave pattern, representing AI audio and music generation.
Uses a gradient from cyan (#69EACB) through purple (#A78BFA) to pink
(#D264B6). Thin glowing outline, clean vector style, glass morphism sheen.
Centered, suitable for 32-64px. No text, no shadows, no 3D effects.
```

---

### 3.5 AI 写作 (AI Writing / Content)

**视觉概念：** 文档页面与 AI 自动生成光标

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized document page
with horizontal text placeholder lines and a glowing AI cursor or typing
indicator at the bottom, AI writing assistant aesthetic, subtle gradient
glow from cyan #69EACB through purple #A78BFA to pink #D264B6, thin
luminous outline, glass morphism micro-highlight, futuristic content
generation aesthetic, centered composition, professional UI icon
--ar 1:1 --s 250 --style raw --no realistic, photographic, 3D render,
text, watermark, complex background, busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon shows a stylized document page with abstract horizontal lines
representing text, and a glowing AI cursor at the bottom suggesting
automated writing. Represents AI writing and content generation. Uses a
luminous gradient from cyan (#69EACB) through purple (#A78BFA) to pink
(#D264B6). Thin glowing outline, clean vector style. Centered, suitable
for 32-64px. No actual text, no shadows, no 3D effects.
```

---

### 3.6 AI 编程 (AI Coding)

**视觉概念：** 代码括号与 AI 智能补全光点

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, stylized code angle
brackets or curly braces with a small AI sparkle node between them
suggesting intelligent code completion, developer tools aesthetic, subtle
gradient glow from cyan #69EACB through purple #A78BFA to pink #D264B6,
thin luminous outline, glass morphism micro-highlight, futuristic
programming AI aesthetic, centered composition, professional UI icon
--ar 1:1 --s 250 --style raw --no realistic, photographic, 3D render,
text, watermark, complex background, busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon depicts stylized code brackets (angle brackets or curly braces)
with a small glowing AI node between them, representing AI-powered code
generation and assistance. Uses a gradient from cyan (#69EACB) through
purple (#A78BFA) to pink (#D264B6). Thin glowing outline, clean vector
style, glass morphism sheen. Centered, suitable for 32-64px. No actual
text or code characters, no shadows, no 3D effects.
```

---

### 3.7 AI 设计 (AI Design)

**视觉概念：** 设计工具（色轮/图层）与 AI 智能调节

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized color palette
circle or design layers with a small AI adjustment slider or smart node,
creative design tools aesthetic, subtle gradient glow from cyan #69EACB
through purple #A78BFA to pink #D264B6, thin luminous outline, glass
morphism micro-highlight, futuristic AI design technology aesthetic,
centered composition, professional UI icon --ar 1:1 --s 250 --style raw
--no realistic, photographic, 3D render, text, watermark, complex
background, busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon shows a stylized color palette circle or layered design shapes
with a small glowing AI adjustment indicator, representing AI-assisted
design tools. Uses a luminous gradient from cyan (#69EACB) through purple
(#A78BFA) to pink (#D264B6). Thin glowing outline, clean vector style,
glass morphism micro-highlights. Centered, suitable for 32-64px. No text,
no shadows, no 3D effects.
```

---

### 3.8 AI 数据分析 (AI Data Analysis)

**视觉概念：** 数据仪表盘与 AI 智能洞察

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized dashboard panel
with a pie chart segment and small AI insight lightning bolt or sparkle,
data intelligence aesthetic, subtle gradient glow from cyan #69EACB
through purple #A78BFA to pink #D264B6, thin luminous outline, glass
morphism micro-highlight, futuristic data analysis AI aesthetic, centered
composition, professional UI icon --ar 1:1 --s 250 --style raw --no
realistic, photographic, 3D render, text, watermark, complex background,
busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon depicts a stylized data dashboard with a pie chart segment and a
small AI lightning bolt or sparkle indicator, representing AI-powered data
analysis and business intelligence. Uses a gradient from cyan (#69EACB)
through purple (#A78BFA) to pink (#D264B6). Thin glowing outline, clean
vector style, glass morphism sheen. Centered, suitable for 32-64px.
No text, no shadows, no 3D effects.
```

---

## 四、资源类型图标提示词（Resource Type Icons）

> 共 4 个类型，对应 `data/meta.json` 中的 `resourceCategories`。

---

### 4.1 使用指南 (Guide / Tutorial)

**视觉概念：** 翻开的书本与导航路标

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized open book with
a small navigation compass or waypoint marker above it, learning guide
aesthetic, subtle gradient glow from cyan #69EACB through purple #A78BFA
to pink #D264B6, thin luminous outline, glass morphism micro-highlight,
futuristic education technology aesthetic, centered composition,
professional UI icon --ar 1:1 --s 250 --style raw --no realistic,
photographic, 3D render, text, watermark, complex background, busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon shows a stylized open book with a small navigation compass or
waypoint marker above it, representing a learning guide or tutorial
resource. Uses a luminous gradient from cyan (#69EACB) through purple
(#A78BFA) to pink (#D264B6). Thin glowing outline, clean vector style.
Centered, suitable for 32-64px. No text, no shadows, no 3D effects.
```

---

### 4.2 模板资源 (Template)

**视觉概念：** 结构化表格/模板框架与复制符号

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized clipboard or
structured template grid with a small duplicate or copy indicator in the
corner, reusable template aesthetic, subtle gradient glow from cyan
#69EACB through purple #A78BFA to pink #D264B6, thin luminous outline,
glass morphism micro-highlight, futuristic productivity tool aesthetic,
centered composition, professional UI icon --ar 1:1 --s 250 --style raw
--no realistic, photographic, 3D render, text, watermark, complex
background, busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon depicts a stylized clipboard with a structured template grid
layout and a small duplicate indicator in the corner, representing
reusable template resources. Uses a gradient from cyan (#69EACB) through
purple (#A78BFA) to pink (#D264B6). Thin glowing outline, clean vector
style, glass morphism sheen. Centered, suitable for 32-64px. No text,
no shadows, no 3D effects.
```

---

### 4.3 行业报告 (Report)

**视觉概念：** 数据图表文档与趋势箭头

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized document page
with a small bar chart and upward trend arrow inside it, industry report
and analytics aesthetic, subtle gradient glow from cyan #69EACB through
purple #A78BFA to pink #D264B6, thin luminous outline, glass morphism
micro-highlight, futuristic business intelligence aesthetic, centered
composition, professional UI icon --ar 1:1 --s 250 --style raw --no
realistic, photographic, 3D render, text, watermark, complex background,
busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon shows a stylized document page containing a small bar chart with
an upward trend arrow, representing industry reports and data analysis
documents. Uses a luminous gradient from cyan (#69EACB) through purple
(#A78BFA) to pink (#D264B6). Thin glowing outline, clean vector style.
Centered, suitable for 32-64px. No text, no shadows, no 3D effects.
```

---

### 4.4 内部资料 (Internal Resource)

**视觉概念：** 带锁的文件夹，传达"受保护的专属内容"

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized folder with a
small lock symbol on its front, secure internal resource aesthetic, subtle
gradient glow from cyan #69EACB through purple #A78BFA to pink #D264B6,
thin luminous outline, glass morphism micro-highlight, futuristic secure
document aesthetic, centered composition, professional UI icon --ar 1:1
--s 250 --style raw --no realistic, photographic, 3D render, text,
watermark, complex background, busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon depicts a stylized folder with a small padlock symbol on its
front, representing secure internal resources and protected content. Uses
a gradient from cyan (#69EACB) through purple (#A78BFA) to pink (#D264B6).
Thin glowing outline, clean vector style, glass morphism sheen. Centered,
suitable for 32-64px. No text, no shadows, no 3D effects.
```

---

## 五、功能/板块图标提示词（Feature / Section Icons）

> 共 4 个功能板块图标，用于平台核心功能区域。

---

### 5.1 学习路径 (Learning Path)

**视觉概念：** 阶梯式节点路径与进度光线

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized ascending
stepped pathway with connected circular milestone nodes and a glowing
progress line connecting them, learning journey aesthetic, subtle gradient
glow from cyan #69EACB through purple #A78BFA to pink #D264B6, thin
luminous outline, glass morphism micro-highlight, futuristic education
roadmap aesthetic, centered composition, professional UI icon --ar 1:1
--s 250 --style raw --no realistic, photographic, 3D render, text,
watermark, complex background, busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon shows a stylized ascending stepped pathway with connected
circular milestone nodes and a luminous progress line linking them,
representing a structured learning path. Uses a gradient from cyan
(#69EACB) through purple (#A78BFA) to pink (#D264B6). Thin glowing
outline, clean vector style, glass morphism sheen. Centered, suitable
for 32-64px. No text, no shadows, no 3D effects.
```

---

### 5.2 能力诊断 (Skill Assessment / Diagnosis)

**视觉概念：** 雷达图/能力六边形与扫描光线

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized radar chart or
hexagonal skill web with a scanning sweep line, capability assessment
diagnostic aesthetic, subtle gradient glow from cyan #69EACB through
purple #A78BFA to pink #D264B6, thin luminous outline, glass morphism
micro-highlight, futuristic skill analysis aesthetic, centered
composition, professional UI icon --ar 1:1 --s 250 --style raw --no
realistic, photographic, 3D render, text, watermark, complex background,
busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon depicts a stylized radar chart or hexagonal skill assessment web
with a luminous scanning sweep line, representing AI-powered skill
diagnosis and capability evaluation. Uses a gradient from cyan (#69EACB)
through purple (#A78BFA) to pink (#D264B6). Thin glowing outline, clean
vector style. Centered, suitable for 32-64px. No text, no shadows,
no 3D effects.
```

---

### 5.3 工具集合 (Tool Collection)

**视觉概念：** 工具箱/工具网格与连接节点

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized toolbox or
grid of four small tool symbols arranged in a 2x2 layout with subtle
connection lines between them, curated toolkit aesthetic, subtle gradient
glow from cyan #69EACB through purple #A78BFA to pink #D264B6, thin
luminous outline, glass morphism micro-highlight, futuristic tool
ecosystem aesthetic, centered composition, professional UI icon --ar 1:1
--s 250 --style raw --no realistic, photographic, 3D render, text,
watermark, complex background, busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon shows a stylized grid of four small abstract tool shapes arranged
in a 2x2 layout with subtle connection lines, representing a curated AI
tool collection. Uses a luminous gradient from cyan (#69EACB) through
purple (#A78BFA) to pink (#D264B6). Thin glowing outline, clean vector
style, glass morphism sheen. Centered, suitable for 32-64px. No text,
no shadows, no 3D effects.
```

---

### 5.4 成就/进度 (Achievement / Progress)

**视觉概念：** 奖杯/奖章与进度环

**Midjourney 提示词：**
```
Minimalist flat icon, dark background #09090b, a stylized trophy or medal
badge with a circular progress ring around it showing partial completion,
achievement and gamification aesthetic, subtle gradient glow from cyan
#69EACB through purple #A78BFA to pink #D264B6, thin luminous outline,
glass morphism micro-highlight, futuristic gaming achievement aesthetic,
centered composition, professional UI icon --ar 1:1 --s 250 --style raw
--no realistic, photographic, 3D render, text, watermark, complex
background, busy details
```

**DALL-E 3 提示词：**
```
Design a minimalist flat icon on a solid near-black (#09090b) background.
The icon depicts a stylized trophy or medal badge with a circular progress
ring around it showing partial completion, representing achievement
tracking and gamified progress. Uses a gradient from cyan (#69EACB)
through purple (#A78BFA) to pink (#D264B6). Thin glowing outline, clean
vector style, glass morphism sheen. Centered, suitable for 32-64px.
No text, no shadows, no 3D effects.
```

---

## 六、一致性保障策略

### 6.1 批量生成工作流

**推荐步骤：**

1. **确定基准图标**：先生成 2-3 个图标（建议从"游戏策划"、"AI 对话"、"学习路径"开始），挑选风格最满意的一个作为视觉基准
2. **提取风格种子**：在 Midjourney 中对基准图标使用 `--seed` 参数锁定随机种子，后续图标复用该种子值
3. **Style Reference**：Midjourney v6.1 支持 `--sref [URL]` 参数，将基准图标上传后用作风格参考，这是保持一致性的最有效手段
4. **逐类生成**：按岗位 -> 教程 -> 资源 -> 功能的顺序分组生成，每组内先生成再统一筛选
5. **后期统一处理**：所有图标在 Figma 或 Photoshop 中做最终色彩校准，确保渐变色值完全一致

### 6.2 Midjourney 一致性参数

```
--seed 123456        // 锁定随机种子（替换为实际种子值）
--sref [基准图标URL]  // 风格参考（最强一致性保障）
--sw 100             // 风格权重（50-200，100 为默认）
--s 250              // 全套统一 stylize 值
--style raw          // 全套统一使用 raw 风格
--chaos 5            // 全套低混乱度
```

### 6.3 DALL-E 3 一致性策略

DALL-E 3 没有种子和风格参考参数，一致性主要通过以下方式保障：

1. **精确的风格描述**：每个提示词中保持完全相同的风格描述段落（本指南已统一）
2. **单次会话生成**：在同一个 ChatGPT 会话中连续生成所有图标，模型会自动保持一定的视觉连贯性
3. **迭代微调**：如果某个图标偏离整体风格，在提示词中增加"match the style of the previous icons in this set"
4. **统一后处理**：最终通过设计软件统一调色

### 6.4 Flux Pro 一致性策略

1. **详细且一致的自然语言描述**：Flux 对详细的自然语言响应最好，保持每个提示词结构完全一致
2. **引用先前输出**：某些 Flux 接口支持 image-to-image 模式，可用基准图标作为参考
3. **统一后处理**：与其他平台相同

### 6.5 检查清单

在生成每个图标后，逐项检查：

- [ ] 背景色是否为纯净深色（#09090b 或接近值）
- [ ] 渐变方向是否一致（青绿 -> 紫色 -> 粉色）
- [ ] 线条粗细是否与其他图标一致
- [ ] 图标主体在画面中的大小比例是否一致（约 60-70%）
- [ ] 发光效果强度是否统一
- [ ] 细节复杂度是否适合 32-64px 显示
- [ ] 整体明度和对比度是否与全套协调
- [ ] 是否存在多余文字、阴影或背景元素

---

## 七、进阶技巧与变体

### 7.1 动态/悬停态变体

为实现网站上的悬停动效，可生成每个图标的两个版本：

**默认态（Resting State）：** 使用上述标准提示词，发光效果较弱

**悬停态（Hover State）：** 在提示词中添加：
```
, enhanced luminous glow, stronger neon emission, slightly brighter
gradient intensity, as if the icon is actively energized
```

### 7.2 单色变体（用于小尺寸或特殊场景）

当图标需要在极小尺寸（16-24px）或特殊上下文中使用时：

在提示词中替换渐变描述为：
```
, single color cyan #69EACB, monochrome luminous style, no gradient
```

### 7.3 深色/浅色卡片适配

标准图标已优化为 `#09090b` 底色。如果需要在浅色卡片悬停态（`#1c1c26`）上使用：

在提示词中调整：
```
, dark background #1c1c26
```

### 7.4 组合图标（用于跨领域场景）

当某个功能涉及多个 AI 领域时，可组合两个图标概念：

```
Minimalist flat icon, dark background #09090b, a stylized [概念A元素]
seamlessly merging with [概念B元素], unified by connecting light lines,
[其余标准风格描述]
```

---

## 八、后处理建议

### 8.1 AI 生成后的设计软件处理

1. **背景清理**：AI 生成的"纯色背景"可能不完全纯净，用 Figma/Photoshop 替换为精确的 #09090b
2. **色彩校准**：使用吸管工具检查渐变色值，微调至精确的 #69EACB / #A78BFA / #D264B6
3. **尺寸导出**：
   - SVG 矢量化（推荐通过 Vectorizer.AI 或 Adobe Illustrator 图像描摹）
   - PNG @1x: 64x64px
   - PNG @2x: 128x128px（Retina 屏）
   - 可选 WebP 格式以优化加载
4. **透明背景版本**：移除背景导出透明 PNG，用于需要叠加在渐变卡片上的场景

### 8.2 集成到项目的建议

生成的图标可替换 `data/jobs.json` 中的 emoji `icon` 字段。有两种集成方式：

**方案 A：图片文件替换**
```json
{
  "id": "graphic-designer",
  "name": "平面设计师",
  "icon": "/assets/icons/jobs/graphic-designer.svg",
  "color": "#7c3aed"
}
```
需要修改 `js/app.js` 中图标渲染逻辑，将 emoji 文本替换为 `<img>` 标签。

**方案 B：SVG 内联**
将矢量化的图标直接作为 SVG 代码内联到 HTML 中，可实现 CSS 动画和颜色动态控制。

---

## 九、快速参考卡片

### 所有图标视觉概念速查

| 编号 | 类别 | 名称 | 核心视觉元素 |
|------|------|------|-------------|
| J01 | 岗位 | 游戏策划 | 游戏手柄 + 神经网络节点 |
| J02 | 岗位 | 平面设计师 | 钢笔工具 + AI 光粒子 |
| J03 | 岗位 | UI/UX设计师 | 线框界面 + 智能光标 |
| J04 | 岗位 | 视频剪辑师 | 胶片帧 + AI 波形线 |
| J05 | 岗位 | 内容创作者 | 笔尖 + 数字文字流 |
| J06 | 岗位 | 社媒运营 | 对话气泡 + 网络节点 |
| J07 | 岗位 | 数据分析师 | 柱状图 + 趋势洞察光点 |
| J08 | 岗位 | 音效设计师 | 音波波形 + AI 频率节点 |
| J09 | 岗位 | 3D美术师 | 线框立方体 + AI 粒子 |
| J10 | 岗位 | 市场营销 | 扩音器 + 数据脉冲环 |
| T01 | 教程 | AI对话 | 双对话气泡 + AI 光点 |
| T02 | 教程 | AI绘图 | 画框 + 魔法笔刷粒子 |
| T03 | 教程 | AI视频 | 播放按钮 + 时间线标记 |
| T04 | 教程 | AI音频 | 音符 + 频谱柱 |
| T05 | 教程 | AI写作 | 文档 + AI 光标 |
| T06 | 教程 | AI编程 | 代码括号 + AI 节点 |
| T07 | 教程 | AI设计 | 色轮/图层 + 调节器 |
| T08 | 教程 | AI数据分析 | 仪表盘 + 洞察闪电 |
| R01 | 资源 | 使用指南 | 翻开书本 + 导航标 |
| R02 | 资源 | 模板 | 剪贴板 + 复制标记 |
| R03 | 资源 | 报告 | 图表文档 + 趋势箭头 |
| R04 | 资源 | 内部资料 | 文件夹 + 锁符号 |
| F01 | 功能 | 学习路径 | 阶梯节点 + 进度光线 |
| F02 | 功能 | 能力诊断 | 雷达图 + 扫描线 |
| F03 | 功能 | 工具集合 | 2x2工具网格 + 连线 |
| F04 | 功能 | 成就进度 | 奖杯 + 进度环 |

---

## 十、许可与使用说明

- 通过 AI 工具生成的图标，请确认各平台的商业使用许可政策
- Midjourney Pro/Mega 订阅用户拥有商业使用权
- DALL-E 3 通过 ChatGPT Plus 生成的图像归用户所有，可商用
- 建议对 AI 生成的图标进行二次设计加工后再用于正式产品
- 矢量化处理后的 SVG 文件不受原始 AI 平台许可限制
