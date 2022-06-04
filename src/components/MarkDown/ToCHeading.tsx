const ToCHeading = function ({
  id,
  props,
  HeadingTag,
}: {
  id: string;
  props: any;
  HeadingTag: string;
}) {
  return (
    <a href={`#${id}`} color="#d7d7db">
      <HeadingTag {...props} />
    </a>
  );
};
export default ToCHeading;
