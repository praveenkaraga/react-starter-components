/**
 * Created by ravi.hamsa on 7/2/16.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import PropTypes from "prop-types";
import {escapePress$} from '../../core/rxutils';

const popupStyles = {
    display: 'inline-block'
};

const bodyStyles = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    zIndex: 999,

};
const maskStyles = {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 998
};

const popupContainerStyles = {
    position: 'fixed',
    zIndex: 998,
    backgroundColor: 'rgba(0,0,0,0.5)',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
};

let openPopup;

class Popup extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            open: false
        };
    }

    openPopup() {
        this.setState({
            open: true
        });
        if (this.props.closeOnEscape) {
            escapePress$.take(1).subscribe(() => this.closePopup());
        }
    }

    closePopup() {
        this.setState({
            open: false
        });
    }

    togglePopup() {
        this.state.open ? this.closePopup() : this.openPopup();
    }

    itemClick() {
        if (this.props.itemClick) {
            this.props.itemClick(arguments);
        }
    }

    render() {
        const childProps = {
            togglePopup: this.togglePopup.bind(this),
            closePopup: this.closePopup.bind(this),
            itemClick: this.itemClick.bind(this),
            isOpen: this.state.open,
            isModal: this.props.isModal
        };

        const className = this.props.className || 'popup';
        let children = this.props.children;
        if (!children.map) {
            children = [children];
        }

        return <div style={popupStyles} className={className}>
            {children.map((children, index) => React.cloneElement(children, {
                ...childProps, key: index
            }))}
        </div>;
    }
}

Popup.defaultProps = {
    isModal: true,
    closeOnEscape: true
};


class PopupButton extends Component {
    render() {
        return React.cloneElement(this.props.children, {
            onClick: this.props.togglePopup
        });
    }
}

class PopupBody extends Component {

    componentDidMount() {
        let p = this.portalElement;
        if (!p) {
            p = document.createElement('div');
            // p.onclick = this.maskClick.bind(this);

            const maskElement = document.createElement('div');
            maskElement.onclick = this.maskClick.bind(this);
            // p.appendChild(maskElement);

            const containerElement = document.createElement('div');
            // p.appendChild(containerElement);
            document.body.appendChild(p);

            this.portalElement = p;
            this.containerElement = containerElement;
            this.maskElement = maskElement;

        }
        this.componentDidUpdate();
    }

    updatePortalElementPosition() {
        const p = this.containerElement;
        const maskElement = this.maskElement;
        if (!p) {
            return;
        }

        for (const i in maskStyles) {
            maskElement.style[i] = maskStyles[i];
        }
    }

    hidePortalElement() {
        const p = this.containerElement;
        const maskElement = this.maskElement;
        if (!p) {
            return;
        }
        for (const i in maskStyles) {
            maskElement.style[i] = maskStyles[i];
        }
    }

    componentWillReceiveProps() {
        this.componentDidUpdate();
    }

    componentWillUnmount() {
        document.body.removeChild(this.portalElement);
    }

    maskClick() {
        if (this.props.isModal) {
            this.props.closePopup();
        }
    }

    componentDidUpdate() {
        const {className = ''} = this.props;
        if (this.props.isOpen) {
            ReactDOM.render(<div className={className}
                                 style={bodyStyles}>{React.cloneElement(this.props.children, {
                closePopup: this.props.closePopup
            })}</div>, this.containerElement);
        }
        if (this.props.isOpen !== this.isOpen) {
            if (this.props.isOpen) {
                this.updatePortalElementPosition();
                this.portalElement.appendChild(this.maskElement);
                this.portalElement.appendChild(this.containerElement);
            } else {
                this.hidePortalElement();
                ReactDOM.render(<div className="dummy-container"></div>, this.containerElement);
                try {
                    this.portalElement.removeChild(this.maskElement);
                    this.portalElement.removeChild(this.containerElement);
                } catch (e) {
                    //do nothing
                }
            }
            this.isOpen = this.props.isOpen;
        }
    }

    render() {
        return <div className="popop-body"></div>;
    }
}

export default {
    Popup,
    PopupButton,
    PopupBody
};