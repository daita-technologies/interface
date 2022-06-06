import { Container, Skeleton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import _ from "lodash";
import ReactMarkdown from "react-markdown";
import { HeadingProps } from "react-markdown/lib/ast-to-react";

export const converChildToId = (
  children: React.ReactNode & React.ReactNode[]
) => {
  if (children && children[0]) {
    return children[0].toString().replace(/" "/g, "");
  }
  return "";
};

const ToCHeading = function ({
  node,
  children,
  ...props
}: React.PropsWithChildren<HeadingProps>) {
  const id = converChildToId(children);
  return (
    <a href={`#${id}`} color="#d7d7db">
      <node.tagName {...props}>{children}</node.tagName>
    </a>
  );
};

const FormatedPTag = function (props: any) {
  return <p {...props} style={{ textAlign: "justify" }} />;
};

const ContentHeading = function ({
  node,
  children,
  ...props
}: React.PropsWithChildren<HeadingProps>) {
  const newProps = {
    ...props,
    id: converChildToId(children),
  };
  return <node.tagName {...newProps}>{children}</node.tagName>;
};
const SkeletonToC = function () {
  return (
    <>
      {_.times(9, (i) => (
        <Typography key={i}>
          <Skeleton />
        </Typography>
      ))}
    </>
  );
};
const SkeletonContent = function () {
  return (
    <>
      <Typography variant="h1" mb="16px">
        <Skeleton />
      </Typography>
      {_.times(4, (i) => (
        <Typography key={i}>
          <Skeleton />
        </Typography>
      ))}
    </>
  );
};
const MarkdownPage = function ({
  content,
  isLoading,
}: {
  content: string;
  isLoading?: boolean;
}) {
  const emptyFunc = () => null;

  return (
    <Container maxWidth="lg">
      <Box>
        <Box display="flex" flexDirection="row" columnGap={2}>
          <Box flex={1}>
            <Box
              id="tocMarkdown"
              sx={{
                position: "sticky",
                top: 0,
                maxHeight: "calc(100vh - 66px)",
                overflowY: "auto",
                paddingTop: 3,
                paddingBottom: 3,
              }}
            >
              {isLoading ? (
                <SkeletonToC />
              ) : (
                <ReactMarkdown
                  components={{
                    a: emptyFunc,
                    p: emptyFunc,
                    ul: emptyFunc,
                    text: emptyFunc,
                    h1: ToCHeading,
                    h2: ToCHeading,
                    h3: ToCHeading,
                    h4: ToCHeading,
                    h5: ToCHeading,
                    h6: ToCHeading,
                  }}
                >
                  {content}
                </ReactMarkdown>
              )}
            </Box>
          </Box>
          <Box flex={2} lineHeight={1.5} mt={2} mb={4}>
            {isLoading ? (
              <SkeletonContent />
            ) : (
              <ReactMarkdown
                components={{
                  p: FormatedPTag,
                  h1: ContentHeading,
                  h2: ContentHeading,
                  h3: ContentHeading,
                  h4: ContentHeading,
                  h5: ContentHeading,
                  h6: ContentHeading,
                }}
              >
                {content}
              </ReactMarkdown>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
MarkdownPage.defaultProps = {
  isLoading: false,
};
export default MarkdownPage;
