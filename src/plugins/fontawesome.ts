import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {faUser, faCalendarAlt, faHouse, faHeart, faLock, faEnvelope, faEye, faEyeSlash, faBell, faSearch, faCaretDown, faExclamationCircle, faFileAlt, faNewspaper, faClock, faChartBar} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

library.add(faUser, faCalendarAlt, faEnvelope, faGithub, faTwitter, faHouse, faHeart, faLock, faEye, faEyeSlash, faBell, faSearch, faCaretDown, faExclamationCircle, faFileAlt, faNewspaper,
    faClock, faChartBar);

export default FontAwesomeIcon;