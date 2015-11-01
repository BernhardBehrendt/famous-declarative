/*global require*/
(function (DOMElement, FamousEngine, Declarative, Window) {
    'use strict';


    var Representation,
        iWinHeight = Window.height(),
        iWinWidth = Window.width(),
        scene = FamousEngine.createScene();


    Representation = new Declarative(scene, {
        protected: [
            'meta'
        ],
        root: {
            back: {
                meta: {
                    node: {
                        setMountPoint: [.5, .5],
                        setAbsoluteSize: [iWinWidth * 0.25, iWinHeight * 0.25],
                        setAlign: [.5, .5],
                        setSizeMode: ['absolute', 'absolute', 'absolute'],
                        setOrigin: [.5, .5],
                        setPosition: [.5, .5, -100]
                    },

                    element: {
                        content: 'This is the back side of the declarative added DOM elements',
                        attr: {
                            id: 'back'
                        },
                        prop: {
                            backgroundColor: '#05b5e7',
                            fontFamily: 'Verdana',
                            textAlign: 'center',
                            fontSize: '20px',
                            paddingTop: ((iWinWidth * 0.25) / 3.5) + 'px'
                        }
                    }
                }
            },
            front: {
                meta: {
                    node: {
                        setMountPoint: [.5, .5],
                        setAbsoluteSize: [iWinWidth * 0.25, iWinHeight * 0.25],
                        setAlign: [.5, .5],
                        setSizeMode: ['absolute', 'absolute', 'absolute'],
                        setOrigin: [.5, .5],
                        setPosition: [.5, .5, 100]

                    },

                    element: {
                        content: 'This is the front side of the declarative added DOM elements',
                        attr: {
                            id: 'front'
                        },
                        prop: {
                            backgroundColor: '#e7ca05',
                            fontFamily: 'Verdana',
                            textAlign: 'center',
                            fontSize: '20px',
                            paddingTop: ((iWinWidth * 0.25) / 3.5) + 'px'
                        }
                    }
                }
            },
            meta: {
                node: {
                    setMountPoint: [.5, .5],
                    setAbsoluteSize: [window.innerWidth, window.innerHeight],
                    setAlign: [.5, .5],
                    setOrigin: [.5, .5],
                    setSizeMode: ['absolute', 'absolute', 'absolute']
                },

                element: {
                    attr: {
                        id: 'root'
                    },
                    prop: {
                        backgroundColor: 'transparent'
                    }
                }
            }
        }
    });


    Representation.back.setRotation(0, 180 * (Math.PI / 180), 0);


    var spinner = Representation.root.addComponent({
        onUpdate: function (time) {
            Representation.root.setRotation(0, time / 500, 0);
            Representation.root.requestUpdateOnNextTick(spinner);
        }
    });

// Let the magic begin...
    Representation.root.requestUpdate(spinner);

    new DOMElement(Representation.root);

    FamousEngine.init();
})(
    require('famous/dom-renderables/DOMElement'),
    require('famous/core/FamousEngine'),
    require('./lib/declarative'),
    $(window)
);

