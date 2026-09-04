# メガネミスト A2縦3枚 POP とモニター画像

## 最終仕様（2026-09-04）

- ユーザーの訂正「A2サイズを3枚」を最優先。A1の指示は失効。
- A2仕上がり420×594mmを横に3枚、全体1260×594mm。板厚5mmは仮設定。
- 市販ハレパネの未裁断外寸ではなく紙規格A2の仕上がり寸法。裁断して使う前提。[メーカー寸法](https://www.platinum-pen.co.jp/products/harepane/11191/)のAA2-5は455×605×5mm。
- 板単体は自立しない。固定具・支柱・転倒防止・什器の耐荷重は別途確認。固定具の外寸は未計上。
- アプリで「MIST-A2」を検索。一体版は幅1260mm以上の天板へ、分割版は左／中央／右をそれぞれの什器へ配置。
- モニターを選択し「モニター画面」→「メガネミスト画像」。スマートフォン幅では「詳細」を開く。

## 画像とPDF

- 最終画像：assets/pop/megane-mist-a2-triptych-v1.png
- モニター画像：assets/screens/megane-mist-hero-v1.png（ユーザー提供1672×941pxを無加工コピー）
- output/pdf/megane-mist-A2x3-full.pdf：1260×594mm・1ページ
- output/pdf/megane-mist-A2x3-panels.pdf：420×594mm・左→中央→右の3ページ
- PDFは原画像を縦横比を保って等倍割付け。印刷設定100%（用紙に合わせるはOFF）で、出力機の印刷可能範囲にも注意。トンボ／塗り足しなし。
- ネイティブ生成解像度1824×862px、実寸換算約36.8dpi。配置・寸法確認用PDFであり、高精細な入稿完成データではない。拡大印刷前に試し刷りし、小さい文字・ロゴ・商品表記を校正。必要なら高解像度版または文字の組版が別途必要。
- 生成画像の輪郭・文字はラスター。PDF化によって解像度は増加しない。

## 生成方法と出典

- 内蔵 image_gen の編集モードを使用（CLI/API未使用）。生成PNGのC2PAメタデータに gpt-image version 2.0 を確認。
- 参照元：ユーザー提供「codex-clipboard-de119189-5eda-4126-8519-550a47efcdd8.png」。
- 選定画像：exec-3fdf885e-6779-4acb-88a7-7c03455ceef9.png。元生成ファイルを残し、プロジェクトへコピー。
- 元のメガネミストの配色・商品・文言をもとに横長へ再構成。3等分の継ぎ目から文字、ボトル、眼鏡を避ける調整を実施。
- 以下は実際の全プロンプト。初回のA1指定は最終仕様ではなく、上記A2訂正および最終編集プロンプトが優先。

## 初回

```text
Use case: ads-marketing / compositing edit.
Input image 1 is the edit target and sole authoritative reference for product identity, Japanese wording, brand, colors and photographs.
Create the actual flat large-format exhibition POP artwork, NOT a booth mockup, NOT a photograph of mounted boards. Transform this portrait Japanese MEGANE MIST flyer into ONE panoramic landscape artwork, physical size 1782 mm wide x 841 mm high (three portrait A1 sheets 594 x 841 mm placed side by side). Match aspect ratio 1782:841 as closely as possible at the highest available image resolution.
Preserve the premium white, deep navy and warm blurred optical-store palette and the same dark cobalt-blue trigger bottle with clear trigger, label identity and Nishimura branding. Keep realistic eyeglasses, white cleaning cloth, and the three eyeglass handling/cleaning photos recognizable. Do not invent product claims, logos, prices or certifications.
Design for viewing several meters away: elegant large Japanese headline, very prominent product name, crisp print typography, calm white space. Recompose rather than stretch the portrait original.
Use a seamless pale optical-store backdrop with THREE invisible equal vertical design zones. No printed divider lines or panel numbers. The future cuts are at exactly 1/3 and 2/3 width. Keep all text, logos, bottle and important photographic subjects at least 18 mm inside each panel's edges so seams do not cut letters or product. The composition should still feel like one coherent wide premium advertisement.
LEFT third: a strong refined text-led panel, huge navy headline 'お渡し前の、' / '最後のひと吹き。', then large bold 'メガネミスト', English 'MEGANE MIST', navy strap 'フレーム用クリーナー＆ケア剤', supporting line 'フレームまで美しく仕上げて、お客様へ。'. Lower area use three compact benefits with simple navy outline icons and EXACT labels 'きれいに見える', 'つるっとした仕上がりへ', '汚れをつきにくくする※'. Include the source Nishimura logo and 'since 1909' neatly near bottom.
CENTER third: hero product photo of the SAME blue MEGANE MIST spray bottle, fully visible from trigger to base, upright, large but not touching panel edges; glasses resting on white cloth near base. Include a neat circular callout with '汚れを' / 'つきにくくする' / '成分配合※' and subordinate copy 'なめらかな仕上がりで' / 'つるっとした' / '美しい仕上がりへ。'. Include '中性・アルコールフリー設計' and '毎日の仕上げに安心してご使用いただけます。' in a compact outlined box near bottom.
RIGHT third: headline 'レンズはきれいにしていても、' / 'フレーム全体はどうでしょうか？'. Below, three elegant horizontal photo rows stacked vertically: photo on one side, numeral and description on other. '01 加工後' / '加工・組み立て後の汚れに。'; '02 調整後' / 'フィッティングでついた指紋や皮脂汚れに。'; '03 お渡し前' / 'フレーム全体をきれいに整えて、お客様へ。'. Use the reference photos showing frame assembly, hands adjusting glasses, cloth wiping glasses. Clean grid, generous spacing, no text overlay over busy photos.
Legible footnote within RIGHT panel bottom, exact: '※すべての汚れの付着を防ぐものではありません。使用環境や素材によって効果は異なります。'
Make all supplied Japanese text accurate and sharp. Do not add any unrequested slogans. Keep exact product silhouette and intended branding as faithfully as possible. Print artwork edge-to-edge, no external page border, no crop marks, no perspective, no fake board seams, no extra furniture, no watermark.
```

## 解像度・構成調整（不採用）

```text
Edit the attached wide MEGANE MIST POP, keeping this exact design, all typography, all Japanese copy, the bottle, the logo, all three right-side photos and the overall aspect ratio unchanged. This is a production finishing pass, not a redesign.
1. Increase native output resolution to 3840 pixels wide (height approximately 1812 pixels, preserving the 1782:841 panorama ratio) with genuinely sharper fine Japanese lettering and product/photographic detail; return the largest available high-resolution artwork. This is for a 1782 x 841 mm exhibition POP, not a small screen preview.
2. One localized composition correction only: the eyeglasses near the bottom of the CENTRAL third currently cross the invisible cut at one-third of image width. Shift and if necessary slightly reduce those central eyeglasses and their cloth so the entire eyeglass frame lies fully between x=35.5% and x=63.5% of the full canvas. Do not cover the bottle. Keep their realistic shape and styling unchanged.
Do not shift any other content. Do not change the wording, logo, bottle silhouette, color palette or copy hierarchy. No visible seam lines, crop marks, panel labels or border. Flat artwork only.
```

## 最終編集（採用）

```text
Make ONLY this local edit to the attached original wide advertisement. Keep the canvas aspect ratio, all Japanese lettering, all logos, all other images and the bottle absolutely unchanged.
The eyeglasses resting on the white cloth near the bottom center are too far left. Shrink ONLY these central eyeglasses to 65% of their current size and move them slightly RIGHT. Their ENTIRE frame and temples must be inside horizontal coordinates 37% through 49% of the full canvas. Place the smaller glasses on the cloth just LEFT of the large upright blue bottle; do not overlap or cover the bottle. The smaller central eyeglasses should no longer extend across x=33.33%, the future print seam. Restore the vacated area with matching white cloth/background. Do not alter the three right-hand eyeglass photos.
This remains the same continuous triptych artwork for three portrait A2 sheets, each 420x594mm, total1260x594mm. No visible fold lines or panel borders. No global redesign, resizing of typography or cropping. Preserve the original near-2.12:1 landscape aspect ratio.
```

