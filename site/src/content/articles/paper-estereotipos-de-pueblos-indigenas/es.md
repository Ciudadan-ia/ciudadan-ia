---
title: "Pides una imagen de un pueblo indígena y llega el cliché. Se cuenta por país, no por pueblo"
lang: es
status: validado
summary: >
  Dos estudios midieron el estereotipo en los programas que generan imágenes a partir de
  una frase. El equipo de ViSAGe (ACL, 2024) reportó que los rasgos estereotipados
  aparecen tres veces más seguido que los demás, y que el resultado es más ofensivo para
  identidades de África, Sudamérica y el sudeste asiático. Un equipo de Meta AI y Mila
  (FAccT, 2024) reunió más de 65 000 anotaciones y halló que quien mira desde fuera de una
  región ve esas imágenes como más representativas que quien vive ahí. La advertencia:
  ninguna medición desagrega por pueblo ni cubre América Latina.
topic: arte-creatividad
subtopic: textil-e-iconografia-indigena
format: paper
audience: [general, docentes, comunidades]
publishDate: "2026-09-04"
author: "Redacción CIUDADAN-IA"
editor: "Felipe Solar Luksic"
aiAssisted: true
production:
  model: claude-fable-5-1
  batch: 1
  manualVersion: "1.0"
keywords: [estereotipos, representacion, "generadores de imagen", "pueblos indigenas", sesgo, "sur global"]
related: [proteccion-colectiva-de-iconografia, ficha-tlahuitoltepec-blusa-mixe]
sources:
  - title: "ViSAGe: A Global-Scale Analysis of Visual Stereotypes in Text-to-Image Generation"
    url: "https://arxiv.org/abs/2401.06310"
    publisher: "arXiv / Association for Computational Linguistics (ACL 2024)"
    date: "2024-07"
    type: paper
    license: n/c
    isPrimary: true
  - title: "Towards Geographic Inclusion in the Evaluation of Text-to-Image Models"
    url: "https://arxiv.org/html/2405.04457v1"
    publisher: "Meta AI / Mila-McGill University, en FAccT '24 (ACM)"
    date: "2024-06"
    type: paper
    license: n/c
    isPrimary: true
  - title: "AI image generator Stable Diffusion perpetuates racial and gendered stereotypes, study finds"
    url: "https://www.eurekalert.org/news-releases/1009576"
    publisher: "University of Washington (vía EurekAlert!, AAAS)"
    date: "2023-11"
    type: comunicado
    license: n/c
  - title: "How AI images are 'flattening' Indigenous cultures – creating a new form of tech colonialism"
    url: "https://theconversation.com/how-ai-images-are-flattening-indigenous-cultures-creating-a-new-form-of-tech-colonialism-246972"
    publisher: "The Conversation"
    date: "2025-03"
    type: reportaje
    license: "CC BY-ND"
  - title: "Belleza, género y edad: así retrata la IA generativa la diversidad de las personas latinas"
    url: "https://factchequeado.com/teexplicamos/20250507/ia-imagenes-diversidad-latinos/"
    publisher: "Factchequeado (proyecto de Chequeado y Maldita.es)"
    date: "2025-05"
    type: reportaje
    license: n/c
    isLatam: true
paper:
  title: "ViSAGe: A Global-Scale Analysis of Visual Stereotypes in Text-to-Image Generation"
  authors: ["Akshita Jha", "Vinodkumar Prabhakaran", "Remi Denton", "Sarah Laszlo", "Shachi Dave", "Rida Qadri", "Chandan K. Reddy", "Sunipa Dev"]
  year: 2024
  venue: "Association for Computational Linguistics (ACL 2024); preprint en arXiv"
  url: "https://arxiv.org/abs/2401.06310"
---

## Qué quisieron saber: si el sombrero que se repite se puede contar

En mayo de 2025, el equipo de Factchequeado —proyecto de Chequeado y Maldita.es— produjo más de 60 imágenes de personas latinas con DALL-E 3 y Midjourney. El sombrero volvió una y otra vez. En Midjourney salieron además flores, tocados, joyería y ropas tradicionales. Detrás de ese ejercicio hay una pregunta de investigación: ¿el cliché se puede contar? El equipo que armó el recurso ViSAGe, presentado en la conferencia ACL en julio de 2024, se propuso convertir esa impresión en medida.

## Cómo lo estudiaron: separaron objetos, compararon caras, preguntaron a personas

ViSAGe partió la lista en dos: los estereotipos que tienen forma visible, como un sombrero, y los que no la tienen, como «atractivo». Solo los primeros se pueden buscar dentro de una imagen. Con esa lista, el equipo revisó estereotipos asociados a 135 nacionalidades en generadores de texto a imagen, los programas que producen una imagen a partir de una frase escrita.

Sourojit Ghosh y Aylin Caliskan, de la Universidad de Washington, tomaron otro camino en noviembre de 2023. Pidieron 50 imágenes de una persona de frente y repitieron el pedido para seis continentes y 26 países. Compararon los grupos con un puntaje de 0 a 1, donde 1 indica el mayor parecido.

Un tercer equipo, de Meta AI y Mila-McGill, sumó en junio de 2024 lo que ningún puntaje registra. Reunió más de 65 000 anotaciones de personas ubicadas en África, Europa y el sudeste asiático. Anotar es revisar imagen por imagen y marcar qué se ve.

## Qué encontraron: el cliché pesa tres veces más y desde lejos parece fiel

Está documentado, según el estudio de ViSAGe de 2024, que los rasgos estereotipados aparecen tres veces más seguido que los demás en las imágenes de la identidad correspondiente. Las representaciones resultan además más ofensivas para identidades de África, Sudamérica y el sudeste asiático. Y la imagen que sale sin pedir ningún rasgo se corre igual hacia el cliché, sobre todo en los grupos del Sur global.

El comunicado de la Universidad de Washington de noviembre de 2023 muestra la ausencia. «Una persona de Oceanía» se parecía más a personas de Australia (0.77) que a personas de Papúa Nueva Guinea (0.31); Nueva Zelanda quedó en 0.74. Ghosh describe ahí una desaparición casi completa de las identidades indígenas y no binarias.

Piensa en la vitrina de recuerdos del aeropuerto: lo indígena cabe en tres objetos que se reconocen en dos segundos. El equipo de Meta AI y Mila midió ese efecto. Si la imagen trae objetos estereotipados, quien anota desde fuera de la región la ve más representativa que quien vive ahí. Los de lejos quedan conformes; quien es de ahí no se reconoce.

## Qué no dicen estos estudios sobre los pueblos de América Latina

Ninguna de estas mediciones desagrega por pueblo. ViSAGe trabaja por nacionalidad, no por pueblo, lengua ni [endónimo](/articulos/glosario-endonimo/), el nombre con que un pueblo se llama a sí mismo. El equipo de Meta AI y Mila declara su límite: tres regiones amplias, seis objetos, tres fuentes de imágenes, y América Latina no está entre ellas. Las cifras de la Universidad de Washington vienen del comunicado y corresponden a un solo generador en su versión de 2023.

Sobre iconografía indígena hay casos descritos, no conteos. John McMullan y Glen Stasiuk relataron en The Conversation, en marzo de 2025, que versiones tempranas de Midjourney respondían al pedido «Indigenous Australians» con lo que parecían imágenes de pueblos africanos. También vieron a un generador poner un tocado papú a un anciano First Nations. Nadie sabe todavía qué sale si el pedido se escribe en una lengua originaria o con el endónimo del pueblo.

## Qué puedes hacer antes de publicar una imagen generada

Guarda el pedido exacto y las imágenes que salieron: sin ese registro no hay nada que revisar después. Compara el resultado con el material que la propia comunidad publica. Consulta a personas de ese pueblo antes de publicar, no después.

El equipo de Meta AI y Mila recomienda algo parecido para evaluar: reunir la mirada de dentro y la de fuera de la región. El contraste entre las dos es lo que deja ver el estereotipo. Si trabajas en una escuela o en un medio, pide a quien vende el generador la evaluación que hizo por región. McMullan y Stasiuk sostienen que el avance empieza por el diálogo entre empresas de IA, investigadores, gobiernos y comunidades indígenas.

## Fuentes

1. Jha, A. et al., [ViSAGe: A Global-Scale Analysis of Visual Stereotypes in Text-to-Image Generation](https://arxiv.org/abs/2401.06310), arXiv / Association for Computational Linguistics (ACL), julio de 2024. Revisado por pares (conferencia); se consultó el resumen.
2. Hall, M. et al., [Towards Geographic Inclusion in the Evaluation of Text-to-Image Models](https://arxiv.org/html/2405.04457v1), Meta AI y Mila-McGill, en FAccT '24 (ACM), junio de 2024. Revisado por pares.
3. Universidad de Washington, [AI image generator Stable Diffusion perpetuates racial and gendered stereotypes, study finds](https://www.eurekalert.org/news-releases/1009576), EurekAlert! (AAAS), noviembre de 2023. Comunicado institucional sobre el estudio presentado en EMNLP 2023.
4. McMullan, J. y Stasiuk, G., [How AI images are 'flattening' Indigenous cultures – creating a new form of tech colonialism](https://theconversation.com/how-ai-images-are-flattening-indigenous-cultures-creating-a-new-form-of-tech-colonialism-246972), The Conversation, marzo de 2025. Reportaje de análisis; CC BY-ND.
5. Rubio, I., [Belleza, género y edad: así retrata la IA generativa la diversidad de las personas latinas](https://factchequeado.com/teexplicamos/20250507/ia-imagenes-diversidad-latinos/), Factchequeado (Chequeado y Maldita.es), mayo de 2025. Reportaje.
