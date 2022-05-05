import { Box, Slider, Stack, Typography } from "@mui/material";
import * as React from "react";
import {
  AugmentationMethod,
  AUTO_ORIENTATION,
  BRIGHTNESS,
  CONTRAST,
  HUE,
  ImageProcessingTemplateProp,
  NORMALIZE_BRIGHTNESS,
  NORMALIZE_CONTRAST,
  NORMALIZE_HUE,
  NORMALIZE_SATURATION,
  PreprocessingMethod,
  ROTATE,
  SATURATION,
} from "./type";

const valuePercent = (value: number) => `${value}%`;
const valueDeg = (value: number) => `${value}°`;

function CanvasComp({
  name,
  src,
  getFilter,
}: {
  name: string;
  src: string;
  getFilter: (
    context: CanvasRenderingContext2D,
    image: HTMLImageElement,
    canvas: HTMLCanvasElement
  ) => CanvasRenderingContext2D;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(
    null
  );
  React.useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext("2d");
      if (renderCtx) {
        const canvasWidth = canvasRef.current?.width as number;
        const canvasHeight = canvasRef.current?.height as number;

        const img = new Image();
        img.src = src;
        img.onload = () => {
          const ctx = getFilter(
            renderCtx,
            img,
            canvasRef.current as HTMLCanvasElement
          );
          ctx.clearRect(0, 0, img.width, img.height);
          ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            (canvasWidth - canvasWidth) / 2,
            (canvasHeight - canvasHeight) / 2,
            canvasWidth,
            canvasHeight
          );
          if (ctx) {
            setContext(ctx);
          }
        };
      }
    }
  }, [context, getFilter, src]);

  return <canvas key={name} id={name} ref={canvasRef} />;
}

function ImageProcessingTemplate({
  src,
  processingParam,
}: {
  src: string;
  processingParam: ImageProcessingTemplateProp;
}) {
  const { method, setting, filter } = processingParam;
  const [value, setValue] = React.useState<number>(setting.min);
  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };
  return (
    <Stack sx={{ width: "100%" }}>
      <Box style={{ textAlign: "center" }}>
        <CanvasComp
          src={src}
          name={method}
          getFilter={(context) => {
            context.filter = filter(value);
            return context;
          }}
        />
      </Box>
      <Box style={{ textAlign: "center", marginTop: 10 }}>
        <Box>
          <Slider
            value={value}
            aria-label="Default"
            valueLabelDisplay="auto"
            onChange={handleChange}
            getAriaValueText={setting.settingValueFormater}
            marks={[
              {
                value: setting.min,
                label: setting.settingValueFormater(setting.min),
              },
              {
                value: setting.max,
                label: setting.settingValueFormater(setting.max),
              },
            ]}
            min={setting.min}
            max={setting.max}
          />
        </Box>
      </Box>
    </Stack>
  );
}
function ImageRotateProcessing({ src }: { src: string }) {
  const [value, setValue] = React.useState<number>(0);
  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };
  return (
    <Stack sx={{ width: "100%" }}>
      <Box style={{ textAlign: "center" }}>
        <Box display="flex" justifyContent="center">
          <img
            src={src}
            alt="rotate"
            style={{
              transform: `rotate(${value}deg)`,
              maxWidth: "75%",
              maxHeight: "50%",
            }}
          />
        </Box>
      </Box>
      <Box style={{ textAlign: "center" }}>
        <Box>
          <Slider
            value={value}
            aria-label="Default"
            valueLabelDisplay="auto"
            onChange={handleChange}
            getAriaValueText={valuePercent}
            marks={[
              {
                value: -90,
                label: valueDeg(-90),
              },
              {
                value: 90,
                label: valueDeg(90),
              },
            ]}
            min={-90}
            max={90}
          />
        </Box>
      </Box>
    </Stack>
  );
}
const hue: ImageProcessingTemplateProp = {
  method: HUE,
  filter: (value) => `hue-rotate(${value}deg)`,
  setting: {
    min: 0,
    max: 360,
    settingValueFormater: valueDeg,
  },
};
const contrast: ImageProcessingTemplateProp = {
  method: CONTRAST,
  filter: (value) => `contrast(${value})`,
  setting: {
    min: 1,
    max: 100,
    settingValueFormater: valuePercent,
  },
};
const saturation: ImageProcessingTemplateProp = {
  method: SATURATION,
  filter: (value) => `saturate(${value}%)`,
  setting: {
    min: 0,
    max: 200,
    settingValueFormater: valuePercent,
  },
};

const brightness: ImageProcessingTemplateProp = {
  method: BRIGHTNESS,
  filter: (value: number) => `brightness(${value})`,
  setting: {
    min: 1,
    max: 100,
    settingValueFormater: valuePercent,
  },
};
function ImageProcessing({
  src,
  method,
}: {
  src: string;
  method: AugmentationMethod | null;
}) {
  if (method === HUE) {
    return <ImageProcessingTemplate src={src} processingParam={hue} />;
  }
  if (method === CONTRAST) {
    return <ImageProcessingTemplate src={src} processingParam={contrast} />;
  }
  if (method === SATURATION) {
    return <ImageProcessingTemplate src={src} processingParam={saturation} />;
  }
  if (method === BRIGHTNESS) {
    return <ImageProcessingTemplate src={src} processingParam={brightness} />;
  }

  if (method === ROTATE) {
    return <ImageRotateProcessing src={src} />;
  }
  return (
    <Stack sx={{ width: "100%" }}>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "Gray",
          textAlign: "center",
          margin: 0,
        }}
      >
        <Typography variant="body1" fontWeight={500} lineHeight={10}>
          A live preview is not available for this action
        </Typography>
      </Box>
    </Stack>
  );
}
export default ImageProcessing;
