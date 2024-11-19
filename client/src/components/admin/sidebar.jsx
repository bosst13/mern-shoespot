import React from 'react'
import { Link } from 'react-router-dom'
import Dashboard from './dashboard';

function Sidebar() {
  return (
    <div className="sidebar-wrapper">
        <nav id="sidebar">
            <ul className='list-unstyled components'>
                <li>
                    <Dashboard />
                </li>
                <li>
                        <a href="#productSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                            className="fa fa-product-hunt"></i> Products</a>
                        <ul className="collapse list-unstyled" id="productSubmenu">
                            <li>
                                <Link to="/admin/products"><i className="fa fa-clipboard"></i> All</Link>
                            </li>

                            <li>
                                <Link to="/admin/product"><i className="fa fa-plus"></i> Create</Link>
                            </li>
                        </ul>
                    </li>
                    {/* <li>
                        <a href="#userSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                            className="fa fa-product-hunt"></i> Users</a>
                        <ul className="collapse list-unstyled" id="userSubmenu">
                            <li>
                                <Link to="/admin/user"><i className="fa fa-clipboard"></i> All</Link>
                            </li>
                        </ul>
                    </li> */}
                    <li>
                        <a href="#chartSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                            className="fa fa-product-hunt"></i> Charts</a>
                        <ul className="collapse list-unstyled" id="chartSubmenu">
                            <li>
                                <Link to="/admin/charts"><i className="fa fa-clipboard"></i> All</Link>
                            </li>
                        </ul>
                    </li>
            </ul>
        </nav>
    </div>
  );
};

export default Sidebar