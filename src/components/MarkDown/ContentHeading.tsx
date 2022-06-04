const ContentHeading = function ({
  HeadingTag,
  id,
  props,
}: {
  HeadingTag: string;
  id: string;
  props: any;
}) {
  return <HeadingTag {...props} id={id} />;
};
export default ContentHeading;
