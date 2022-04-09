import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import {
  ORIGINAL_SOURCE,
  PREPROCESS_SOURCE,
  TEST_DATA_NUMBER_INDEX,
  TRAINING_DATA_NUMBER_INDEX,
  VALIDATION_DATA_NUMBER_INDEX,
} from "constants/defaultValues";
import { useDispatch, useSelector } from "react-redux";
import {
  changeSelectedDataSource,
  setIsEditingSplitData,
  setSplitDataNumber,
} from "reduxes/project/action";
import {
  selectorCurrentProjectOriginalSplitDataNumber,
  selectorCurrentProjectPreprocessSplitDataNumber,
  selectorCurrentProjectTotalOriginalImage,
  selectorCurrentProjectTotalPreprocessImage,
  selectorIsEditingSplitData,
  selectorIsFetchingDetailProject,
  selectorSelectedDataSource,
} from "reduxes/project/selector";
import { SPLIT_DATA_NUMBER_SOURCE_TYPE } from "reduxes/project/type";
import SplitDataNumberBox from "./SplitDataNumberBox";
import {
  DataSetSplitProps,
  SplitDataFormFields,
  SPLIT_DATA_TYPE,
} from "./type";
import SliderInput from "./SliderInput";

const DATA_SOURCE_SELECT_ID = "data-source-select";

const DataSetSplit = function (props: DataSetSplitProps) {
  const [isSplitDataMatchTotal, setIsSplitDataMatchTotal] = useState<
    null | boolean
  >(null);

  const dispatch = useDispatch();
  const isEditing = useSelector(selectorIsEditingSplitData);

  const totalOriginalImages = useSelector(
    selectorCurrentProjectTotalOriginalImage
  );

  const totalPreprocessImages = useSelector(
    selectorCurrentProjectTotalPreprocessImage
  );

  const originalSplitDataNumber = useSelector(
    selectorCurrentProjectOriginalSplitDataNumber
  );
  const preprocessSplitDataNumber = useSelector(
    selectorCurrentProjectPreprocessSplitDataNumber
  );

  const splitDataNumber = {
    [ORIGINAL_SOURCE]: originalSplitDataNumber,
    [PREPROCESS_SOURCE]: preprocessSplitDataNumber,
  };

  const selectedDataSource = useSelector(selectorSelectedDataSource);

  const isFetchingDetailProject = useSelector(selectorIsFetchingDetailProject);

  const splitDataNumberBySource = splitDataNumber[selectedDataSource] || [
    0, 0, 0,
  ];

  const totalImagesByDataSource = useMemo(() => {
    if (selectedDataSource === ORIGINAL_SOURCE) {
      return totalOriginalImages;
    }

    if (selectedDataSource === PREPROCESS_SOURCE) {
      return totalPreprocessImages;
    }

    return 0;
  }, [selectedDataSource, totalOriginalImages, totalPreprocessImages]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
    getValues,
  } = useForm<SplitDataFormFields>({
    defaultValues: {
      training: splitDataNumberBySource[TRAINING_DATA_NUMBER_INDEX],
      validation: splitDataNumberBySource[VALIDATION_DATA_NUMBER_INDEX],
      test: splitDataNumberBySource[TEST_DATA_NUMBER_INDEX],
    },
  });
  const splitDataInputValues = watch();
  const getRemainingData = (values: {
    training: number;
    validation: number;
    test: number;
  }) => {
    const splitTotalFromInput =
      Number(values.training || 0) +
      Number(values.validation || 0) +
      Number(values.test || 0);
    return totalImagesByDataSource - splitTotalFromInput;
  };
  useEffect(() => {
    if (getRemainingData(splitDataInputValues) === 0) {
      setIsSplitDataMatchTotal(true);
    }
  }, [splitDataInputValues]);
  const onDataSourceSelectChange = (event: SelectChangeEvent) => {
    dispatch(
      changeSelectedDataSource({
        newSelectedDataSource: event.target
          .value as SPLIT_DATA_NUMBER_SOURCE_TYPE,
      })
    );
  };

  const onClickEditSplit = () =>
    dispatch(setIsEditingSplitData({ isEditing: true }));

  const onClickSaveSplit = (splitData: SplitDataFormFields) => {
    const splitTotal =
      Number(splitData.training) +
        Number(splitData.validation) +
        Number(splitData.test) || 0;

    if (
      (selectedDataSource === ORIGINAL_SOURCE &&
        splitTotal === totalOriginalImages) ||
      (selectedDataSource === PREPROCESS_SOURCE &&
        splitTotal === totalPreprocessImages)
    ) {
      setIsSplitDataMatchTotal(true);
      dispatch(
        setSplitDataNumber({
          typeMethod: selectedDataSource,
          splitDataNumber: [
            Number(splitData.training),
            Number(splitData.validation),
            Number(splitData.test),
          ],
        })
      );
      dispatch(setIsEditingSplitData({ isEditing: false }));
      reset({
        training: splitData.training,
        validation: splitData.validation,
        test: splitData.test,
      });
    } else {
      setIsSplitDataMatchTotal(false);
    }
  };

  useEffect(() => {
    dispatch(setIsEditingSplitData({ isEditing: false }));
  }, [selectedDataSource]);

  const renderTotalImagesTextByDataSource = () => (
    <>
      <Typography variant="body2">
        Total Images: {totalImagesByDataSource}
      </Typography>
      {totalImagesByDataSource === 0 && (
        <Typography variant="caption" fontStyle="italic">
          {selectedDataSource === ORIGINAL_SOURCE
            ? "Upload images to split the data."
            : "Generate preprocessed images to split the data."}
        </Typography>
      )}
    </>
  );

  const renderSelectDataSource = () => (
    <FormControl
      fullWidth
      disabled={
        isFetchingDetailProject === null || isFetchingDetailProject === true
      }
    >
      <InputLabel id={`${DATA_SOURCE_SELECT_ID}-label`}>Data source</InputLabel>
      <Select
        id={DATA_SOURCE_SELECT_ID}
        labelId={`${DATA_SOURCE_SELECT_ID}-label`}
        value={selectedDataSource}
        onChange={onDataSourceSelectChange}
        label="Data source"
      >
        <MenuItem value={ORIGINAL_SOURCE}>Original</MenuItem>
        <MenuItem value={PREPROCESS_SOURCE}>Preprocess</MenuItem>
      </Select>
    </FormControl>
  );

  const renderSplitDataRemainText = () => {
    const splitTotalFromInput =
      Number(splitDataInputValues.training || 0) +
      Number(splitDataInputValues.validation || 0) +
      Number(splitDataInputValues.test || 0);
    const remainingData = totalImagesByDataSource - splitTotalFromInput;
    return (
      <Typography
        variant="body2"
        color={remainingData < 0 ? "error.light" : "text.primary"}
      >
        Remaining data:{" "}
        <Typography variant="body2" component="span" fontWeight={500}>
          {remainingData}
        </Typography>
      </Typography>
    );
  };
  const mSplitDataInfo: Record<
    "TRAINING" | "VALIDATION" | "TEST",
    { name: "training" | "validation" | "test"; splitDataType: SPLIT_DATA_TYPE }
  > = {
    TRAINING: {
      name: "training",
      splitDataType: TRAINING_DATA_NUMBER_INDEX,
    },
    VALIDATION: {
      name: "validation",
      splitDataType: VALIDATION_DATA_NUMBER_INDEX,
    },
    TEST: {
      name: "test",
      splitDataType: TEST_DATA_NUMBER_INDEX,
    },
  };
  const renderSplitDataNumberBar = () => {
    const isInitialSplit =
      splitDataInputValues.test !== 0 ||
      splitDataInputValues.training !== 0 ||
      splitDataInputValues.test !== 0;

    const handleChange = (dataForm: SplitDataFormFields) => {
      Object.entries(mSplitDataInfo).map(([, value]) =>
        setValue(value.name, dataForm[value.name])
      );
    };

    return (
      <Stack sx={{ width: "100%" }}>
        <Stack direction="row">
          {Object.entries(mSplitDataInfo).map(([key, value]) => (
            <SplitDataNumberBox
              key={key}
              splitDataType={value.splitDataType as SPLIT_DATA_TYPE}
              splitValue={splitDataNumberBySource[value.splitDataType]}
              total={totalImagesByDataSource}
              isEditing={isEditing}
              control={control}
              getValues={getValues}
              name={value.name}
              setValue={setValue}
              isInitialSplit={isInitialSplit}
            />
          ))}
        </Stack>

        {isEditing && (
          <SliderInput
            dataForm={splitDataInputValues}
            total={totalImagesByDataSource}
            onChange={handleChange}
          />
        )}
      </Stack>
    );
  };

  const renderContent = () => {
    if (isFetchingDetailProject === null || isFetchingDetailProject === true) {
      return (
        <Box my={3} display="flex" alignItems="center" justifyContent="center">
          <CircularProgress size={20} />
        </Box>
      );
    }

    return (
      <>
        {isEditing ? (
          <Box>{renderSplitDataRemainText()}</Box>
        ) : (
          <Box>{renderTotalImagesTextByDataSource()}</Box>
        )}
        <Box display="flex" mt={2}>
          {renderSplitDataNumberBar()}
        </Box>
        <Box textAlign="center" mt={1}>
          {(isSplitDataMatchTotal === false ||
            (errors && Object.keys(errors).length > 0)) && (
            <Typography color="error" variant="caption">
              {Object.keys(errors).length > 0
                ? errors.test?.message ||
                  errors.training?.message ||
                  errors.validation?.message
                : `Split data is not equal total images: ${totalImagesByDataSource}`}
            </Typography>
          )}
        </Box>
      </>
    );
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Typography fontWeight={500}>Training/Validation/Test Split</Typography>
        <Box sx={{ minWidth: 120 }}>{renderSelectDataSource()}</Box>
        <Button
          sx={{ alignSelf: "flex-start" }}
          color="inherit"
          variant="outlined"
          size="small"
          disabled={
            (!isEditing && totalImagesByDataSource <= 0) ||
            isFetchingDetailProject === null ||
            isFetchingDetailProject === true
          }
          onClick={
            isEditing ? handleSubmit(onClickSaveSplit) : onClickEditSplit
          }
        >
          {isEditing ? "Confirm" : "Edit Split"}
        </Button>
      </Box>

      {renderContent()}
    </Box>
  );
};

export default DataSetSplit;
