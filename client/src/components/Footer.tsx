export default function Footer() {
  return (
    <footer className="bg-gray-300 dark:bg-gray-800  text-gray-700 dark:text-gray-100 p-4">
      <div className="container mx-auto text-center text-sm ">
        © {new Date().getFullYear()} E-shop | All rights reserved.
      </div>
    </footer>
  );
}
