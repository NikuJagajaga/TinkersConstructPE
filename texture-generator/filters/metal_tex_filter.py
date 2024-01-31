from . import MetalColorFilter, TexColorFilter, RGBA


class MetalTexFilter(MetalColorFilter):

    def __init__(self, color_hex: str, shinyness: float, brightness: float, hueshift: float, tex_path: str):
        super().__init__(color_hex, shinyness, brightness, hueshift)
        self.tex_filter = TexColorFilter(tex_path)
    
    def pre_process(self, data: list[RGBA]):
        data2 = self.tex_filter.apply(data)
        for i in range(len(data)) :
            data[i] = data2[i]
