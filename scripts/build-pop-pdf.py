"""Package the unmodified GPT Image artwork at exact A2 trim dimensions."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMAGE = ROOT / "assets/pop/megane-mist-a2-triptych-v1.png"
OUT = ROOT / "output/pdf"
OUT.mkdir(parents=True, exist_ok=True)
width, height = Image.open(IMAGE).size
art = ImageReader(str(IMAGE))
full_w, full_h = 1260 * mm, 594 * mm
# Uniform scale: no distortion/cropping of the artwork. Center any tiny ratio mismatch.
factor = min(full_w / width, full_h / height)
draw_w, draw_h = width * factor, height * factor
origin_x, origin_y = (full_w - draw_w) / 2, (full_h - draw_h) / 2
for name, pages, page_w in [
    ("megane-mist-A2x3-full.pdf", 1, full_w),
    ("megane-mist-A2x3-panels.pdf", 3, 420 * mm),
]:
    target = OUT / name
    doc = canvas.Canvas(str(target), pagesize=(page_w, full_h), pageCompression=1)
    doc.setTitle("MEGANE MIST - A2 portrait x 3 - trim size 1260 x 594 mm")
    doc.setAuthor("Sannishimura / GPT Image 2.0 artwork")
    for index in range(pages):
        doc.bookmarkPage(f"panel-{index+1}")
        doc.addOutlineEntry(["Left", "Center", "Right"][index] if pages == 3 else "Full artwork", f"panel-{index+1}")
        doc.drawImage(art, origin_x - index * page_w, origin_y, width=draw_w, height=draw_h)
        doc.showPage()
    doc.save()
    reader = PdfReader(target)
    assert len(reader.pages) == pages
    for page in reader.pages:
        assert abs(float(page.mediabox.width) - page_w) < .01
        assert abs(float(page.mediabox.height) - full_h) < .01
    print(f"Verified {name}: {pages} page(s), {page_w/mm:.0f} x 594 mm")
print(f"Native image {width} x {height} px; effective resolution {width/(1260/25.4):.1f} dpi. Print proof required.")
