import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import ContentHeading from "components/MarkDown/ContentHeading";
import ToCHeading from "components/MarkDown/ToCHeading";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { HeadingProps } from "react-markdown/lib/ast-to-react";
import contentMd from "./content.md";

const Terms = function () {
  const [content, setContent] = useState("");
  useEffect(() => {
    fetch(contentMd)
      .then((response) => response.text())
      .then((text) => {
        setContent(text);
      });
  }, []);
  const emptyFunc = () => null;
  const converChildToId = (children: React.ReactNode & React.ReactNode[]) => {
    if (children && children[0]) {
      return children[0].toString().replaceAll(" ", "");
    }
    return "";
  };
  const convertToCHeading = ({
    node,
    children,
    ...props
  }: React.PropsWithChildren<HeadingProps>) => (
    <ToCHeading
      HeadingTag={node.tagName}
      id={converChildToId(children)}
      props={{ children, ...props }}
    />
  );
  const convertToContentHeading = ({
    node,
    children,
    ...props
  }: React.PropsWithChildren<HeadingProps>) => (
    <ContentHeading
      HeadingTag={node.tagName}
      id={converChildToId(children)}
      props={{ children, ...props }}
    />
  );
  return (
    <>
      <Box
        sx={{
          bgcolor: "#808785",
          background:
            "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgb(96 96 144) 35%, rgb(62 74 93) 100%)",
        }}
        height="9vh"
        lineHeight="9vh"
        textAlign="center"
        fontSize={30}
      >
        Terms
      </Box>
      <Container maxWidth="lg">
        <Box mt={4}>
          <Box display="flex" flexDirection="row">
            <Box width="100%" flex={1}>
              <div style={{ position: "fixed", top: "14vh" }}>
                <ReactMarkdown
                  components={{
                    a: emptyFunc,
                    p: emptyFunc,
                    text: emptyFunc,
                    h1: convertToCHeading,
                    h2: convertToCHeading,
                    h3: convertToCHeading,
                    h4: convertToCHeading,
                    h5: convertToCHeading,
                    h6: convertToCHeading,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </Box>
            <Box width="100%" flex={2}>
              <ReactMarkdown
                components={{
                  h1: convertToContentHeading,
                  h2: convertToContentHeading,
                  h3: convertToContentHeading,
                  h4: convertToContentHeading,
                  h5: convertToContentHeading,
                  h6: convertToContentHeading,
                }}
              >
                {content}
              </ReactMarkdown>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Terms;
