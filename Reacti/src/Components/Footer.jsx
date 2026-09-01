import React from 'react'
import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer">
            <div className='footer-style'>
                <p className="footer-call">
                    Questions? Call <a href="tel:000-800-919-1743">000-800-919-1743</a>
                </p>

                <div className="footer-links">
                    <ul>
                        <li><a href="https://help.netflix.com/en/node/412">FAQ</a></li>
                        <li><a href="https://ir.netflix.net/ir-overview/profile/default.aspx">Investor Relations</a></li>
                        <li><a href="https://help.netflix.com/legal/privacy">Privacy</a></li>
                        <li><a href="https://fast.com/">Speed Test</a></li>
                    </ul>
                    <ul>
                        <li><a href="https://help.netflix.com/en">Help Centre</a></li>
                        <li><a href="https://jobs.netflix.com/">Jobs</a></li>
                        <li><a href="#">Cookie Preferences</a></li>
                        <li><a href="https://help.netflix.com/legal/notices">Legal Notices</a></li>
                    </ul>
                    <ul>
                        <li>
                            <Link to="/signin" className="footer-link">
                                Account
                            </Link>
                        </li>
                        <li><a href="https://help.netflix.com/en/node/14361">Ways to Watch</a></li>
                        <li><a href="https://help.netflix.com/en/node/134094">Corporate Information</a></li>
                        <li><a href="#">Only on Netflix</a></li>
                    </ul>
                    <ul>
                        <li><a href="#">Media Centre</a></li>
                        <li><a href="https://help.netflix.com/legal/termsofuse">Terms of Use</a></li>
                        <li><a href="https://help.netflix.com/en/contactus">Contact Us</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}