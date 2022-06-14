export const triggerPresignedURLDownload = (
  href: string,
  defaultFileName: string
) => {
  const downloadBtn = document.createElement("a");
  downloadBtn.setAttribute("target", "_blank");
  downloadBtn.setAttribute("download", `${defaultFileName}.zip`);
  downloadBtn.href = href;
  downloadBtn.style.display = "none";
  document.documentElement.appendChild(downloadBtn);
  downloadBtn.click();

  setTimeout(() => {
    document.documentElement.removeChild(downloadBtn);
  }, 1000);
};

export const triggerDownloadTemp = () => null;
