import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Footer() {
    return (
        <>
            <footer className="bg-dark text-white mt-5 py-4">
                {/* ... Footer ... */}
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <h5 className="text-danger">Game Verse</h5>
                            <p>Tu tienda de videojuegos con los mejores precios y lanzamientos.</p>
                        </div>
                        <div className="col-md-4">
                            <h5 className="text-danger">Contacto</h5>
                            <p><i className="bi bi-envelope-fill"></i> contacto@gameverse.com</p>
                            <p><i className="bi bi-telephone-fill"></i> (+51) 985 526 872</p>
                        </div>
                        <div className="col-md-4">
                            <h5 className="text-danger">Síguenos</h5>
                            <div className="d-flex gap-3">
                                <a href="https://facebook.com" className="text-white fs-4"><i className="bi bi-facebook"></i></a>
                                <a href="#" className="text-white fs-4"><i className="bi bi-instagram"></i></a>
                                <a href="#" className="text-white fs-4"><i className="bi bi-twitch"></i></a>
                                <a href="#" className="text-white fs-4"><i className="bi bi-twitter"></i></a>
                                <a href="#" className="text-white fs-4"><i className="bi bi-youtube"></i></a>
                            </div>
                        </div>
                    </div>
                    <hr className="my-4 bg-danger" />
                    <div className="text-center">
                        <p>&copy; 2025 Game Verse. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
export default Footer;