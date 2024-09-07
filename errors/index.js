import RepositoryNotFoundError from './repository-not-found.error.js';
import EpubNotFoundError from './epub-not-found.error.js';
import RepositoryAlredyExistsError from './repository-already-exists.error.js';
import BadParamsError from './bad-params.error.js';

module.exports = {
    BadParamsError,
    EpubNotFoundError,
    RepositoryAlredyExistsError,
    RepositoryNotFoundError,
}