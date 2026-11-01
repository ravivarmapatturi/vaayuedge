from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, BaseDocTemplate, Frame, PageTemplate, NextPageTemplate, FrameBreak, Paragraph, Spacer, Table, TableStyle, KeepTogether, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
out=Path('output/pdf/inferedge-english-telugu-arxiv-style.pdf')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='Paper',fontName='Times-Roman',fontSize=9.5,leading=11.6,spaceAfter=6,alignment=4))
styles.add(ParagraphStyle(name='PaperTitle',fontName='Times-Bold',fontSize=17,leading=20,alignment=TA_CENTER,spaceAfter=15))
styles.add(ParagraphStyle(name='Meta',fontName='Times-Roman',fontSize=9,leading=11,alignment=TA_CENTER,spaceAfter=12))
story=[]
def p(s): story.append(Paragraph(s,styles['Paper']))
styles['Heading2'].fontName='Times-Bold'
styles['Heading2'].fontSize=11
styles['Heading2'].leading=13
styles['Heading2'].spaceBefore=9
styles['Heading2'].spaceAfter=5
def h(s): story.append(Paragraph(s,styles['Heading2']))
def footer(c,d):
 c.setFont('Times-Roman',9); c.drawString(54,30,'InferEdge AI | Preliminary research draft | Not submitted'); c.drawRightString(558,30,str(d.page))
story.append(Paragraph('A Reproducible English-Telugu Adaptation Pilot<br/>Toward Memory-Constrained Translation',styles['PaperTitle']))
story.append(Paragraph('InferEdge AI / VaayuEdge research project<br/>Working draft - 29 October 2026<br/>Authorship and affiliations to be finalized before submission',styles['Meta']))
story.append(FrameBreak())
h('Abstract')
p('We report an initial, reproducible adaptation experiment for English-to-Telugu translation using a compact 76.9-million-parameter pretrained Marian model. We prepare 8,511 conversational parallel pairs and run a bounded 100-step GPU fine-tuning pilot. Complete evaluations cover 1,503 conversational and 1,024 general-domain IN22 examples using matched decoding. Conversational BLEU changes from 3.852 to 3.879, while chrF++ declines from 28.367 to 27.150; general-domain BLEU declines from 3.675 to 2.013 and chrF++ from 26.863 to 19.986. These preliminary results do not establish improvement and indicate that the present checkpoint should not replace production. We describe data provenance, model preservation, evaluation settings, limitations, and the remaining experiments required to establish edge-device usefulness. No device-memory, latency, energy, human-evaluation, or competitor-superiority claim is made.')
h('1 Introduction')
p('InferEdge AI investigates intelligence across modalities on devices constrained by memory, compute, energy, and connectivity. VaayuEdge is its first product, addressing English-to-Telugu conversation through speech recognition, translation, and speech synthesis. This report isolates text translation so that changes can be measured independently before testing the complete speech pipeline. Training uses a cloud GPU; intended deployment requires separate measurement on laptops and phones.')
p('The immediate question is whether a short conversational adaptation of an existing compact translator can improve measured translation quality without increasing its architecture. The present contribution is an experimental pipeline and preliminary evidence, rather than a new architecture or a demonstrated state-of-the-art system. Upstream model and data contributions remain explicitly attributed.')
h('2 Model and data')
p('The base checkpoint is Helsinki-NLP/opus-mt-en-dra [1], pinned at revision 5ecfd223f954f860b67f1b4c42e6f4c70d347581. The model has approximately 76.9 million parameters. The Telugu language prefix is &gt;&gt;tel&lt;&lt;. The pilot fine-tunes these pretrained parameters; it is not training a foundation model from scratch.')
p('The training component is BPCC-H-Daily Telugu, attributed to AI4Bharat and the IndicTrans2 authors [2,3]. Its upstream README identifies the newly added Daily component as CC-BY-4.0; the collection includes other components whose permissions must not be inferred from this component. Cleaning retained 8,511 pairs from 8,512 imported rows. A deterministic normalized-source hash split yields 7,673 training, 412 validation and 426 internal test pairs.')
story.append(Spacer(1,3))
h('3 Experimental protocol')
p('Local decontamination found zero exact normalized-source overlaps with the pinned IN22-Conv and IN22-Gen evaluation inputs. This is a limited exact-match check: it does not exclude near duplicates, document-level leakage, or overlap with the upstream checkpoint training data. Internal holdout results therefore cannot establish unseen-domain generalization.')
rows=[['Setting','Pilot configuration'],['Optimizer','AdamW; learning rate 0.00002'],['Budget','100 optimizer steps; batch size 4'],['Sequence length','Maximum 128 tokens during training'],['Random seed','42'],['Compute','Kaggle T4 configuration; one GPU used'],['Validation','412 pairs; final token loss 2.7890'],['Saved run','Kaggle version 363252210']]
t=Table([[Paragraph(str(c),ParagraphStyle('tc',fontName='Times-Roman',fontSize=8,leading=9.5)) for c in r] for r in rows],colWidths=[80,166]);t.setStyle(TableStyle([('FONTNAME',(0,0),(-1,-1),'Times-Roman'),('FONTNAME',(0,0),(-1,0),'Times-Bold'),('FONTSIZE',(0,0),(-1,-1),10),('BACKGROUND',(0,0),(-1,0),colors.HexColor('#eeeeee')),('LINEBELOW',(0,0),(-1,0),.5,colors.black),('BOTTOMPADDING',(0,0),(-1,-1),5)]));story.append(KeepTogether([t]));story.append(Spacer(1,10))
p('At batch size four, 100 steps process approximately 400 training examples, well below one epoch over the available split. The committed rerun completed in 111.5 seconds total; its displayed training loop took approximately 24 seconds. These durations exclude any edge-device inference characterization. The notebook confirms CUDA was used. The saved version exposes final and last checkpoints, SafeTensors weights, tokenizer/configuration files, and artifact manifests [4].')
p('The downloaded archive is checked against saved file sizes and SHA-256 fingerprints before local evaluation. Both benchmark passes use the same Telugu prefix, maximum generation length 256, three beams, early stopping, and CPU execution. Repeated benchmark sources are aligned by occurrence order. sacreBLEU 2.6.0 [5] reports case-sensitive BLEU with 13a tokenization and chrF++ with character order six and word order two. All reported scores have complete coverage and zero empty predictions.')
h('4 Preliminary results')
rows=[['Benchmark / model','N','BLEU','chrF++'],['IN22-Conv / baseline','1,503','3.852','28.367'],['IN22-Conv / 100-step pilot','1,503','3.879','27.150'],['IN22-Gen / baseline','1,024','3.675','26.863'],['IN22-Gen / 100-step pilot','1,024','2.013','19.986']]
t=Table([[Paragraph(str(c),ParagraphStyle('tc',fontName='Times-Roman',fontSize=8,leading=9.5)) for c in r] for r in rows],colWidths=[125,35,43,43]);t.setStyle(TableStyle([('FONTNAME',(0,0),(-1,-1),'Times-Roman'),('FONTNAME',(0,0),(-1,0),'Times-Bold'),('FONTSIZE',(0,0),(-1,-1),10),('BACKGROUND',(0,0),(-1,0),colors.HexColor('#eeeeee')),('LINEBELOW',(0,0),(-1,0),.5,colors.black),('BOTTOMPADDING',(0,0),(-1,-1),5)]));story.append(KeepTogether([t]));story.append(Spacer(1,9))
p('The conversational BLEU difference is only +0.027 points, with a simultaneous chrF++ decrease of 1.217 points. On general-domain examples, BLEU decreases by 1.663 points and chrF++ by 6.876 points. Without paired uncertainty estimates, the tiny conversational BLEU change does not establish an improvement. The broader regression warrants inspecting translations and training behavior before scaling. Validation loss is not a substitute for external translation metrics.')
story.append(Spacer(1,3))
h('5 Limitations and diagnostic priorities')
p('This report covers one small adaptation budget and one seed. It includes no hyperparameter search, independent Telugu human ratings, paired bootstrap confidence intervals, domain-stratified error analysis, or controlled competitor comparison. Sarvam and newer Indic translation candidates have not been measured here. Their published results must not be conflated with a reproduced comparison.')
p('The training logs warn that model modules were in evaluation mode at training start. Optimizer-step completion verifies execution but does not resolve the intended dropout and training-mode semantics. This warning must be investigated and explicitly corrected or justified before a larger experiment. The matched model configuration, labels, truncation, target-language handling, and decoded failure cases should also be audited. Domain over-adaptation is a hypothesis rather than an established explanation for the observed regression.')
p('Architecture size alone does not demonstrate edge suitability. The pipeline still requires export verification, quantization experiments, quality after quantization, and measurements of process memory, cold and warm latency, throughput, and energy on named devices. Speech-recognition and synthesis costs must be measured separately and together with translation. No production replacement is justified by the present results.')
h('6 Reproducibility and next experiments')
p('Retain the pinned source/model revisions, split hashes, saved Kaggle version, downloaded artifact verification, full prediction files, decoding provenance, and metric signatures. Reports are stored under artifacts/pilot-benchmark-v1, including separate Conv and Gen prediction and metric files. Baseline scores in this draft come from the earlier complete baseline reports; revalidate those artifacts and confirm paired reference identity before using the comparison in a submission.')
p('Next experiments should diagnose the current regression, enforce intended training/evaluation mode transitions, and compare adaptation budgets selected only on validation data. A stronger study requires a held-out final evaluation policy, multiple seeds, uncertainty intervals, blinded native Telugu review, and meaningful edge-device measurements. Until those experiments are completed, this document is a preliminary experimental report suitable for internal review, not a finished publication claiming competitive performance.')
h('References')
refs=[('[1]','Helsinki-NLP. OPUS-MT English-Dravidian checkpoint. https://huggingface.co/Helsinki-NLP/opus-mt-en-dra'),('[2]','AI4Bharat. IndicTrans2 repository, data description and license. https://github.com/AI4Bharat/IndicTrans2'),('[3]','AI4Bharat. IndicTrans2, arXiv:2305.16307 (2023). https://arxiv.org/abs/2305.16307'),('[4]','InferEdge pilot, saved Kaggle version 363252210. https://www.kaggle.com/code/ravivarmapatturi/inferedge-english-telugu-training'),('[5]','Post, M. A Call for Clarity in Reporting BLEU Scores (2018). https://aclanthology.org/W18-6319/')]
for n,r in refs: p(n+' '+r)
doc=BaseDocTemplate(str(out),pagesize=(612,792),leftMargin=48,rightMargin=48,topMargin=42,bottomMargin=44,title='English-Telugu Adaptation Pilot - Preliminary Preprint',author='InferEdge AI research project; authorship pending')
first=[Frame(48,637,516,113,id='title',leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0),Frame(48,44,246,582,id='left1',leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0),Frame(318,44,246,582,id='right1',leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)]
normal=[Frame(48,44,246,706,id='left',leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0),Frame(318,44,246,706,id='right',leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)]
doc.addPageTemplates([PageTemplate(id='First',frames=first,onPage=footer,autoNextPageTemplate='Body'),PageTemplate(id='Body',frames=normal,onPage=footer)])
doc.build(story)
print(out)
