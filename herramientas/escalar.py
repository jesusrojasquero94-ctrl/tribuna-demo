"""Escala cuadros con un modelo ncnn 4x (Real-ESRGAN) en CPU, por mosaicos.

Uso: python3 escalar.py MODELO ENTRADA.webp SALIDA.png [mosaico]
"""
import sys
import numpy as np
import ncnn
from PIL import Image

modelo, entrada, salida = sys.argv[1], sys.argv[2], sys.argv[3]
T = int(sys.argv[4]) if len(sys.argv) > 4 else 200
PAD = 10
S = 4

net = ncnn.Net()
net.opt.use_vulkan_compute = False
net.opt.num_threads = 2
net.load_param(modelo + ".param")
net.load_model(modelo + ".bin")

im = np.asarray(Image.open(entrada).convert("RGB"), dtype=np.float32) / 255.0
H, W, _ = im.shape
out = np.zeros((H * S, W * S, 3), dtype=np.float32)
for y in range(0, H, T):
    for x in range(0, W, T):
        y0, x0 = max(0, y - PAD), max(0, x - PAD)
        y1, x1 = min(H, y + T + PAD), min(W, x + T + PAD)
        tile = np.ascontiguousarray(im[y0:y1, x0:x1].transpose(2, 0, 1))
        ex = net.create_extractor()
        ex.input("data", ncnn.Mat(tile))
        _, r = ex.extract("output")
        r = np.array(r).transpose(1, 2, 0)
        ty, tx = (y - y0) * S, (x - x0) * S
        hh, ww = min(T, H - y) * S, min(T, W - x) * S
        out[y * S:y * S + hh, x * S:x * S + ww] = r[ty:ty + hh, tx:tx + ww]
Image.fromarray((np.clip(out, 0, 1) * 255 + .5).astype(np.uint8)).save(salida)
