const InstagramIcon: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
        rel="stylesheet"
      />

      <i
        className={`fa fa-instagram ${className}`}
        id="insta"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "1.1rem",
        }}
      ></i>
    </>
  );
};

export default InstagramIcon;
