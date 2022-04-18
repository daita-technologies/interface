import CryptoJS from "crypto-js";
import {
  REFRESH_TOKEN_NAME,
  TEMP_LOCAL_USERNAME,
  TOKEN_LIST,
  TOKEN_NAME,
  PREPROCESS_IMAGES_TAB,
  ORIGINAL_IMAGES_TAB,
  AUGMENT_IMAGES_TAB,
  AUGMENT_SOURCE,
  ORIGINAL_SOURCE,
  PREPROCESS_SOURCE,
  AUGMENT_GENERATE_IMAGES_TYPE,
  AUGMENT_GENERATE_IMAGES_TYPE_LABEL,
  PREPROCESSING_GENERATE_IMAGES_TYPE,
  PREPROCESSING_GENERATE_IMAGES_TYPE_LABEL,
  TEMP_LOCAL_FULLNAME,
} from "constants/defaultValues";
import { ApiListProjectsItem } from "reduxes/project/type";
import {
  AlbumImagesFields,
  ImageApiFields,
  ImageSourceType,
} from "reduxes/album/type";
import { S3_BUCKET_NAME } from "constants/s3Values";
import { generateMethodType } from "reduxes/generate/type";
import { TokenStorageName, TokenStorageTypes } from "./type";

export const asyncAction = (actionName: string) => ({
  REQUESTED: `${actionName}_REQUESTED`,
  FAILED: `${actionName}_FAILED`,
  SUCCEEDED: `${actionName}_SUCCEEDED`,
});

export const setLocalStorage = (name: string, value: string | number) =>
  localStorage.setItem(
    name,
    typeof value !== "undefined" ? value.toString() : ""
  );

export const removeLocalStorage = (name: string) =>
  localStorage.removeItem(name);

export const getLocalStorage = (name: string) => localStorage.getItem(name);

export const setLocalToken = (params: { token: string }) => {
  setLocalStorage(TOKEN_NAME, params.token);
};

export const getLocalToken = () => {
  let token = null;

  token = localStorage.getItem(TOKEN_NAME);

  return token;
};

export const setListToken = (data: TokenStorageTypes) =>
  TOKEN_LIST.forEach((tokenStorageName: string) =>
    tokenStorageName === REFRESH_TOKEN_NAME && !data[REFRESH_TOKEN_NAME]
      ? () => {}
      : setLocalStorage(
          tokenStorageName,
          data[tokenStorageName as TokenStorageName]
        )
  );

export const removeListToken = () => {
  TOKEN_LIST.forEach((tokenStorageName: string) =>
    removeLocalStorage(tokenStorageName)
  );
  removeLocalStorage(TEMP_LOCAL_USERNAME);
  removeLocalStorage(TEMP_LOCAL_FULLNAME);
};

export const objectIndexOf = (
  array: Array<any>,
  value: any,
  keyName: string
) => {
  let index = -1;
  array.some((item: any, itemIndex: number) => {
    if (item[keyName] === value) {
      index = itemIndex;
      return true;
    }

    return false;
  });
  return index;
};

export const catZeroCharString = (num: number) =>
  num > -10 && num < 10 ? `0${num}` : `${num}`;

export function formatBytes(bytes: number, decimals: number = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export const separateNumber = (number: string, separator: string = ",") =>
  number ? number.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : number;

export const generateS3Prefix = ({
  bucketName,
  indentityId,
  projectId,
}: {
  bucketName: string;
  indentityId: string;
  projectId: string;
  fileName: string;
}) => `${bucketName}/${indentityId}/${projectId}`;

export const getProjectS3Key = ({
  indentityId,
  projectId,
}: {
  indentityId: string;
  projectId: string;
}) => `${indentityId}/${projectId}`;

export const generatePhotoKey = ({
  indentityId,
  projectId,
  fileName,
}: {
  indentityId: string;
  projectId: string;
  fileName: string;
}) => `${indentityId}/${projectId}/${fileName}`;
export const generateZipFileKey = ({
  indentityId,
  projectId,
  fileName,
}: {
  indentityId: string;
  projectId: string;
  fileName: string;
}) => `${indentityId}/${projectId}/zip/${fileName}`;
export const getLocalProjectInfo = (
  listProjects: Array<ApiListProjectsItem>,
  currentProjectName: string
) => {
  let matchIndex = -1;
  let localProjectInfo: ApiListProjectsItem | null = null;
  listProjects.some((project: ApiListProjectsItem, index: number) => {
    if (project.project_name === currentProjectName) {
      matchIndex = index;
      return true;
    }
    return false;
  });
  if (matchIndex > -1) {
    localProjectInfo = listProjects[matchIndex];
  }

  return localProjectInfo;
};

export const getFileName = (photoKey: string) => {
  const splitArray = photoKey.split("/");
  return splitArray[splitArray.length - 1];
};

export function arrayBufferToWordArray(ab: string | ArrayBuffer | null) {
  if (ab instanceof ArrayBuffer) {
    const i8a = new Uint8Array(ab);
    const a = [];
    for (let i = 0; i < i8a.length; i += 4) {
      a.push(
        (i8a[i] << 24) | (i8a[i + 1] << 16) | (i8a[i + 2] << 8) | i8a[i + 3]
      );
    }

    return CryptoJS.lib.WordArray.create(a, i8a.length);
  }

  return "";
}

export function readAsArrayBuffer(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

export const convertArrayAlbumImageToObjectKeyFileName = (
  images: Array<ImageApiFields>,
  typeMethod: ImageSourceType
): AlbumImagesFields => {
  const albumImageObject: AlbumImagesFields = {};
  images.forEach((image: ImageApiFields) => {
    let photoKey = image.s3_key.replace(`${S3_BUCKET_NAME}/`, "");
    if (photoKey.indexOf(image.filename) < 0) {
      photoKey += `/${image.filename}`;
    }
    albumImageObject[image.filename] = {
      ...image,
      url: "",
      photoKey,
      typeOfImage: typeMethod,
    };
  });
  return albumImageObject;
};

export function a11yProps(name: string, value: number) {
  return {
    id: `${name}-tab-${value}`,
    "aria-controls": `${name}-tabpanel-${value}`,
  };
}

export function switchTabIdToSource(tabId: number) {
  switch (tabId) {
    case PREPROCESS_IMAGES_TAB:
      return PREPROCESS_SOURCE;
    case AUGMENT_IMAGES_TAB:
      return AUGMENT_SOURCE;
    case ORIGINAL_IMAGES_TAB:
    default:
      return ORIGINAL_SOURCE;
  }
}

export function getGenerateMethodLabel(
  type?: generateMethodType | ImageSourceType
) {
  switch (type) {
    case PREPROCESSING_GENERATE_IMAGES_TYPE:
    case PREPROCESS_SOURCE:
      return PREPROCESSING_GENERATE_IMAGES_TYPE_LABEL;
    case AUGMENT_GENERATE_IMAGES_TYPE:
    case AUGMENT_SOURCE:
      return AUGMENT_GENERATE_IMAGES_TYPE_LABEL;

    default:
      return "";
  }
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getLoadImageContentToDownloadActionName = (index: number) =>
  `LOAD_IMAGE_CONTENT_TO_DOWNLOAD${
    index % 10 === 0 ? "" : index % 10
  }_REQUESTED`;

export function typedKeys<T>(o: T): (keyof T)[] {
  return Object.keys(o) as (keyof T)[];
}

export const getProjectNameFromProjectId = (
  listProjects: ApiListProjectsItem[],
  projectId: string
) => {
  if (projectId) {
    const matchProjectIndex = objectIndexOf(
      listProjects,
      projectId,
      "project_id"
    );
    if (matchProjectIndex > 0) {
      return listProjects[matchProjectIndex].project_name;
    }
    return null;
  }

  return null;
};
