type LoadingSpinnerProps = {
  size: string;
};

const LoadingSpinner = ({ size }: LoadingSpinnerProps) => {
  const spinnerClass = `${size} animate-spin rounded-full border-4 border-solid border-green-500 border-t-transparent shadow-md`;
  return <div className={spinnerClass}></div>;
};

export default LoadingSpinner;
