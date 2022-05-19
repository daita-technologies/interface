import { Box, Slider, Stack, Typography } from "@mui/material";
import * as React from "react";
import { prettyMethodName } from "routes/ProjectDetail/PreprocessingOption/ReferenceImageDialog";
import {
  ImageProcessingSourceProps,
  ImageProcessingTemplateProp,
  METHODID_AUGMENTMETHOD,
  RANDOM_BRIGHTNESS,
  RANDOM_CONTRAST,
  RANDOM_HUE,
  RANDOM_ROTATE,
  RANDOM_SATURATION,
  SUPER_RESOLUTION,
} from "./type";

const valuePercent = (value: number) => `${value}%`;
const valueDeg = (value: number) => `${value}°`;

export function CanvasCompView({ src }: { src: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext("2d");
      if (renderCtx) {
        const canvasWidth = canvasRef.current?.width as number;
        const canvasHeight = canvasRef.current?.height as number;

        const img = new Image();
        img.src = src;
        img.onload = () => {
          renderCtx.clearRect(0, 0, img.width, img.height);
          renderCtx.drawImage(
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
        };
      }
    }
  }, [src]);

  return <canvas key={src} ref={canvasRef} />;
}
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
  imageProcessingSourceProps,
  imageProcessingTemplateProp,
}: {
  imageProcessingSourceProps: ImageProcessingSourceProps;
  imageProcessingTemplateProp: ImageProcessingTemplateProp;
}) {
  const { src, methodId } = imageProcessingSourceProps;
  const method = METHODID_AUGMENTMETHOD[methodId];
  const { setting } = imageProcessingTemplateProp;
  const [imagePreview, setImagePreview] =
    React.useState<HTMLImageElement | null>(null);

  const [value, setValue] = React.useState<number>(setting ? setting.min : 0);
  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };
  return (
    <Stack sx={{ width: "100%" }}>
      <Box style={{ textAlign: "center" }}>
        <CanvasComp
          src={src}
          name={prettyMethodName(method.method.toLocaleLowerCase())}
          getFilter={(context, img) => {
            setImagePreview(img);
            context.filter = imageProcessingTemplateProp.filter(value);
            return context;
          }}
        />
      </Box>

      <Box style={{ textAlign: "center", margin: "0px 24px" }}>
        <Box>
          {setting ? (
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
          ) : (
            <Typography variant="subtitle1">
              {method.method === SUPER_RESOLUTION && imagePreview
                ? `Width x Height: ${imagePreview.width} x ${imagePreview.height} pixels `
                : ""}
            </Typography>
          )}
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
      <Box style={{ textAlign: "center", margin: "0px 24px" }}>
        <Box>
          <Slider
            value={value}
            aria-label="Default"
            valueLabelDisplay="auto"
            onChange={handleChange}
            getAriaValueText={valuePercent}
            sx={{ margin: "0px 24px" }}
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
  filter: (value) => `hue-rotate(${value}deg)`,
  setting: {
    min: 0,
    max: 360,
    settingValueFormater: valueDeg,
  },
};
const contrast: ImageProcessingTemplateProp = {
  filter: (value) => `contrast(${value})`,
  setting: {
    min: 1,
    max: 100,
    settingValueFormater: valuePercent,
  },
};
const saturation: ImageProcessingTemplateProp = {
  filter: (value) => `saturate(${value}%)`,
  setting: {
    min: 0,
    max: 200,
    settingValueFormater: valuePercent,
  },
};

const brightness: ImageProcessingTemplateProp = {
  filter: (value: number) => `brightness(${value})`,
  setting: {
    min: 1,
    max: 100,
    settingValueFormater: valuePercent,
  },
};
function ImageProcessing(
  imageProcessingSourceProps: ImageProcessingSourceProps
) {
  const { src, methodId } = imageProcessingSourceProps;
  const augmentationMethodInfo = METHODID_AUGMENTMETHOD[methodId];
  if (augmentationMethodInfo) {
    switch (augmentationMethodInfo.method) {
      case RANDOM_HUE:
        return (
          <ImageProcessingTemplate
            imageProcessingTemplateProp={hue}
            imageProcessingSourceProps={imageProcessingSourceProps}
          />
        );
      case RANDOM_CONTRAST:
        return (
          <ImageProcessingTemplate
            imageProcessingTemplateProp={contrast}
            imageProcessingSourceProps={imageProcessingSourceProps}
          />
        );
      case RANDOM_SATURATION:
        return (
          <ImageProcessingTemplate
            imageProcessingTemplateProp={saturation}
            imageProcessingSourceProps={imageProcessingSourceProps}
          />
        );
      case RANDOM_BRIGHTNESS:
        return (
          <ImageProcessingTemplate
            imageProcessingTemplateProp={brightness}
            imageProcessingSourceProps={imageProcessingSourceProps}
          />
        );
      case RANDOM_ROTATE:
        return <ImageRotateProcessing src={src} />;
      default:
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
  } else {
    return <h6>Method Augmentation Not Available</h6>;
  }
}
export default ImageProcessing;
