'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _rxutils = require('../../core/rxutils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by ravi.hamsa on 7/2/16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var popupStyles = {
    display: 'inline-block'
};

var bodyStyles = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    zIndex: 999

};
var maskStyles = {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 998
};

var popupContainerStyles = {
    position: 'fixed',
    zIndex: 998,
    backgroundColor: 'rgba(0,0,0,0.5)',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
};

var openPopup = void 0;

var Popup = function (_Component) {
    _inherits(Popup, _Component);

    function Popup() {
        _classCallCheck(this, Popup);

        var _this = _possibleConstructorReturn(this, (Popup.__proto__ || Object.getPrototypeOf(Popup)).apply(this, arguments));

        _this.state = {
            open: false
        };
        return _this;
    }

    _createClass(Popup, [{
        key: 'openPopup',
        value: function openPopup() {
            var _this2 = this;

            this.setState({
                open: true
            });
            if (this.props.closeOnEscape) {
                _rxutils.escapePress$.take(1).subscribe(function () {
                    return _this2.closePopup();
                });
            }
        }
    }, {
        key: 'closePopup',
        value: function closePopup() {
            this.setState({
                open: false
            });
        }
    }, {
        key: 'togglePopup',
        value: function togglePopup() {
            this.state.open ? this.closePopup() : this.openPopup();
        }
    }, {
        key: 'itemClick',
        value: function itemClick() {
            if (this.props.itemClick) {
                this.props.itemClick(arguments);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var childProps = {
                togglePopup: this.togglePopup.bind(this),
                closePopup: this.closePopup.bind(this),
                itemClick: this.itemClick.bind(this),
                isOpen: this.state.open,
                isModal: this.props.isModal
            };

            var className = this.props.className || 'popup';
            var children = this.props.children;
            if (!children.map) {
                children = [children];
            }

            return _react2.default.createElement(
                'div',
                { style: popupStyles, className: className },
                children.map(function (children, index) {
                    return _react2.default.cloneElement(children, _extends({}, childProps, { key: index
                    }));
                })
            );
        }
    }]);

    return Popup;
}(_react.Component);

Popup.defaultProps = {
    isModal: true,
    closeOnEscape: true
};

var PopupButton = function (_Component2) {
    _inherits(PopupButton, _Component2);

    function PopupButton() {
        _classCallCheck(this, PopupButton);

        return _possibleConstructorReturn(this, (PopupButton.__proto__ || Object.getPrototypeOf(PopupButton)).apply(this, arguments));
    }

    _createClass(PopupButton, [{
        key: 'render',
        value: function render() {
            return _react2.default.cloneElement(this.props.children, {
                onClick: this.props.togglePopup
            });
        }
    }]);

    return PopupButton;
}(_react.Component);

var PopupBody = function (_Component3) {
    _inherits(PopupBody, _Component3);

    function PopupBody() {
        _classCallCheck(this, PopupBody);

        return _possibleConstructorReturn(this, (PopupBody.__proto__ || Object.getPrototypeOf(PopupBody)).apply(this, arguments));
    }

    _createClass(PopupBody, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var p = this.portalElement;
            if (!p) {
                p = document.createElement('div');
                // p.onclick = this.maskClick.bind(this);

                var maskElement = document.createElement('div');
                maskElement.onclick = this.maskClick.bind(this);
                // p.appendChild(maskElement);

                var containerElement = document.createElement('div');
                // p.appendChild(containerElement);
                document.body.appendChild(p);

                this.portalElement = p;
                this.containerElement = containerElement;
                this.maskElement = maskElement;
            }
            this.componentDidUpdate();
        }
    }, {
        key: 'updatePortalElementPosition',
        value: function updatePortalElementPosition() {
            var p = this.containerElement;
            var maskElement = this.maskElement;
            if (!p) {
                return;
            }

            for (var i in maskStyles) {
                maskElement.style[i] = maskStyles[i];
            }
        }
    }, {
        key: 'hidePortalElement',
        value: function hidePortalElement() {
            var p = this.containerElement;
            var maskElement = this.maskElement;
            if (!p) {
                return;
            }
            for (var i in maskStyles) {
                maskElement.style[i] = maskStyles[i];
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps() {
            this.componentDidUpdate();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            document.body.removeChild(this.portalElement);
        }
    }, {
        key: 'maskClick',
        value: function maskClick() {
            if (this.props.isModal) {
                this.props.closePopup();
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            var _props$className = this.props.className,
                className = _props$className === undefined ? '' : _props$className;

            if (this.props.isOpen) {
                _reactDom2.default.render(_react2.default.createElement(
                    'div',
                    { className: className,
                        style: bodyStyles },
                    _react2.default.cloneElement(this.props.children, {
                        closePopup: this.props.closePopup
                    })
                ), this.containerElement);
            }
            if (this.props.isOpen !== this.isOpen) {
                if (this.props.isOpen) {
                    this.updatePortalElementPosition();
                    this.portalElement.appendChild(this.maskElement);
                    this.portalElement.appendChild(this.containerElement);
                } else {
                    this.hidePortalElement();
                    _reactDom2.default.render(_react2.default.createElement('div', { className: 'dummy-container' }), this.containerElement);
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
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement('div', { className: 'popop-body' });
        }
    }]);

    return PopupBody;
}(_react.Component);

exports.default = {
    Popup: Popup,
    PopupButton: PopupButton,
    PopupBody: PopupBody
};