"""Render the evidence-backed manuscript outline as a two-column research draft."""
from pathlib import Path
from html import escape
import re
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle, FrameBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/pdf/inferedge-english-telugu-arxiv-style.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
body = ParagraphStyle('body', fontName='Times-Roman', fontSize=10, leading=12.5, spaceAfter=6, alignment=4)
head = ParagraphStyle('head', parent=body, fontName='Times-Bold', fontSize=11, leading=13, spaceBefore=8, keepWithNext=True)
title = ParagraphStyle('title', parent=body, fontName='Times-Bold', fontSize=16, leading=18, alignment=1)
cell = ParagraphStyle('cell', parent=body, fontSize=7, leading=8)

def clean(s):
    s = s.replace('English–Telugu','English-Telugu').replace('–','-').replace('—','-')
    for old,new in [('a100-step','a 100-step'),('on1503','on 1503'),('on1024','on 1024'),('before1000','before 1000'),('by+','by +'),('test,+','test, +'),('test,-','test, -'),('Corpus chrF++','Corpus chrF++')]: s=s.replace(old,new)
    s = escape(s)
    s = re.sub(r'`([^`]+)`', r'<i>\1</i>', s)
    return re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', s)

lines = (ROOT / 'docs/manuscript-outline.md').read_text().splitlines()
story = []
section = None
buffer = []
def flush():
    if buffer:
        story.append(Paragraph(clean(' '.join(buffer)), body)); buffer.clear()
i = 0
while i < len(lines):
    line = lines[i]
    if line.startswith('# '):
        i += 1; continue
    if line.startswith('Status:'):
        i += 1; continue
    if line.startswith('## '):
        flush(); section = {'Abstract draft':'Abstract', 'Results to include':'Results', 'Primary references for final bibliography':'References'}.get(line[3:],line[3:])
        if section != 'Proposed title and research question':
            story.append(Paragraph(clean(section), head))
    elif line.startswith('**Small-Budget'):
        story.append(Paragraph(clean(line), title))
        story.append(Paragraph('InferEdge AI / VaayuEdge research project<br/>30 October 2026 - Preliminary draft, not submitted<br/>Authorship and affiliations pending finalization', ParagraphStyle('meta',parent=body,alignment=1)))
        story.append(FrameBreak())
    elif re.match(r'^\d+\. |^- ', line):
        flush(); story.append(Paragraph(clean(line),body))
    elif line.startswith('|'):
        flush(); rows=[]
        while i < len(lines) and lines[i].startswith('|'):
            raw=[x.strip() for x in lines[i].strip('|').split('|')]
            if not all(re.fullmatch(r'[-:]+',x) for x in raw): rows.append([Paragraph(clean(x),cell) for x in raw])
            i+=1
        t=Table(rows,colWidths=[68,20,39,39,39,39],repeatRows=1,hAlign='LEFT')
        t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#eeeeee')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),2),('RIGHTPADDING',(0,0),(-1,-1),2),('BOTTOMPADDING',(0,0),(-1,-1),5)]))
        story.append(t); story.append(Spacer(1,7)); continue
    elif not line.strip(): flush()
    else: buffer.append(line)
    i+=1
flush()
def footer(c,d):
    c.setFont('Times-Roman',8)
    c.drawString(48,25,'InferEdge AI | Research draft - not submitted or accepted')
    c.drawRightString(564,25,str(d.page))
doc=BaseDocTemplate(str(OUT),pagesize=(612,792),title='Small-Budget English-Telugu Conversational Adaptation',author='InferEdge AI research project; authorship pending')
def frame(x,y,w,h): return Frame(x,y,w,h,leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)
first=[frame(48,630,516,118),frame(48,44,244,574),frame(320,44,244,574)]
normal=[frame(48,44,244,704),frame(320,44,244,704)]
doc.addPageTemplates([PageTemplate(id='first',frames=first,onPage=footer,autoNextPageTemplate='body'),PageTemplate(id='body',frames=normal,onPage=footer)])
doc.build(story)
print(OUT)
