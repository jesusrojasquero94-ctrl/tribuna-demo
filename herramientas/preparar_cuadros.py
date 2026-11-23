"""Prepara los juegos de cuadros del recorrido y las fotos HD de la taquilla.

  python3 herramientas/preparar_cuadros.py DIR_ESCALADOS

DIR_ESCALADOS tiene los cuadros reescalados x4 (001.png ... 180.png) que deja escalar.py.
Genera:
  cuadros/b/NNN.webp   640x360, WebP calidad 50  (base: llega completa primero)
  cuadros/hd/NNN.avif  1920x1080, AVIF calidad 50 (detalle alrededor del scroll)
  cuadros/NNN.webp     se quedan como están (960 px, detalle sin AVIF)
Necesita Pillow con soporte AVIF.
"""
import glob
import os
import sys
from concurrent.futures import ProcessPoolExecutor

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def base(f):
    n = os.path.basename(f)
    Image.open(f).convert("RGB").resize((640, 360), Image.LANCZOS).save(os.path.join(RAIZ, "cuadros/b", n), quality=50, method=6)


def hd(f):
    n = os.path.splitext(os.path.basename(f))[0]
    Image.open(f).convert("RGB").resize((1920, 1080), Image.LANCZOS).save(os.path.join(RAIZ, "cuadros/hd", n + ".avif"), quality=50, speed=6)


if __name__ == "__main__":
    os.makedirs(os.path.join(RAIZ, "cuadros/b"), exist_ok=True)
    os.makedirs(os.path.join(RAIZ, "cuadros/hd"), exist_ok=True)
    originales = sorted(glob.glob(os.path.join(RAIZ, "cuadros/[0-9][0-9][0-9].webp")))
    escalados = sorted(glob.glob(os.path.join(sys.argv[1], "[0-9][0-9][0-9].png"))) if len(sys.argv) > 1 else []
    with ProcessPoolExecutor() as ex:
        list(ex.map(base, originales))
        list(ex.map(hd, escalados))
    print(len(originales), "base,", len(escalados), "hd")
