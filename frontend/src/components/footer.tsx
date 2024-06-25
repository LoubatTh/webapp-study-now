const Footer = () => {
  return (
    <div className="">
      <div className="hidden sm:block h-200 py-4 px-10 text-sm shadow-md">
        <div className="flex content-center justify-between">
          <div className="">
            <div className="p-2">
              <img></img>
              <p>Logo du site</p>
            </div>
            <div className="px-1 py-4">
              <p>Rendre l'apprentissage plus simple</p>
            </div>
          </div>
          <div className="flex">
            <div className="p-2 content-center">
              <ul>
                <a className="p-1 underline" href="">github</a>
                <a className="p-1 underline" href="">contact</a>
              </ul>
            </div>
          </div>
        </div>
        <hr className="border-t border-gray-300"></hr>
        <div className="px-1 py-4">
          <p className="text-xs">© 2020 'nom du site', Inc. Tout droit réservé.</p>
        </div>
      </div>
      <div className="sm:hidden h-200 py-4 px-10 text-sm shadow-md">
        <div className="flex content-center justify-between">
          <div className="">
            <div className="p-2">
              <img></img>
              <p>Logo du site</p>
            </div>
            <div className="p-2">
              <p>Rendre l'apprentissage plus simple</p>
            </div>
            <div className="px-1 pt-1 pb-4">
              <ul>
                <a className="p-1 underline" href="">github</a>
                <a className="p-1 underline" href="">contact</a>
              </ul>
            </div>
          </div>
        </div>
        <hr className="border-t border-gray-300"></hr>
        <div className="px-1 py-4">
          <p className="text-xs">© 2020 'nom du site', Inc. Tout droit réservé.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;