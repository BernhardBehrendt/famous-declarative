/*global require*/
/*global module*/
var Declarative = null;

(function (DOMElement) {
    "use strict";

    /**
     * Setup famous scenes and dom elements by a JSON style configuration and provide access on each node via map object

     * A huge set of aspects can be controlled via JSON configuration such as:
     * - Scene properteis (Origin Align, Scale...)
     * - DOM Properties (CSS)
     * - DOM Content (HTML and Text)
     *
     * @class Declarative
     * @param targetScene {Object} The target where the bootstrapped structure is appended
     * @param Declaration {Object} A JSON representation of the final node structure
     * @return {Object} The node map which gives access on each node and dom element
     *
     * @constructor
     */
    Declarative = function (targetScene, Declaration) {

        /**
         * The Famous Node structure containing Attributes, Properties, Content
         *
         * @proptery declaration
         * @type {Object}
         */
        this.declaration = Declaration;

        /**
         * The Representation for any item which was previously built based on declaration specification
         *
         * @property nodeMap
         * @type {Object}
         */
        this.nodeMap = {};


        /**
         * Applies any specified meta propertie on the given reference of a famous node
         *
         * @method applyMeta
         * @param target {Object}
         * @param meta {Object}
         */
        this.applyMeta = function (target, meta) {

            var method, attr, prop, len;

            if (meta.node !== undefined) {

                for (method in meta.node) {
                    if (meta.node.hasOwnProperty(method)) {

                        len = meta.node[method].length;

                        if (len === 1) {
                            target[method](meta.node[method][0]);
                        } else if (len === 2) {
                            target[method](meta.node[method][0], meta.node[method][1]);
                        } else if (len === 3) {
                            target[method](meta.node[method][0], meta.node[method][1], meta.node[method][2]);
                        } else if (len === 4) {
                            target[method](meta.node[method][0], meta.node[method][1], meta.node[method][2], meta.node[method][3]);
                        }
                    }
                }
            }


            if (meta.element !== undefined) {

                target.domElement = new DOMElement(target);

                if (meta.element.content !== undefined) {
                    target.domElement.setContent(meta.element.content);
                }

                if (meta.element.attr !== undefined) {
                    for (attr in meta.element.attr) {

                        if (meta.element.attr.hasOwnProperty(attr)) {
                            target.domElement.setAttribute(attr, meta.element.attr[attr]);
                        }
                    }
                }


                if (meta.element.prop !== undefined) {
                    for (prop in meta.element.prop) {
                        if (meta.element.prop.hasOwnProperty(prop)) {
                            target.domElement.setProperty(prop, meta.element.prop[prop]);
                        }
                    }
                }
            }
        };

        /**
         * Recursively iterates the declaration and perform the basic setup.
         * If there is any meta information stored for a node it's also applied
         * The result is attached into the reference of the given node map in a one dimension matter
         *
         * @method setupDeclaration
         * @param declaration {Object} The full/partial object declaration which will be bootsrapped
         * @param nodeMap {Object} The map containing all nodes by it's initial key name
         * @param parentNode {Object} A new nodes parent node
         * @param protectedProps {Array} The properties which should not be applied as a node e.g. meta
         */
        this.setupDeclaration = function (declaration, nodeMap, parentNode, protectedProps) {
            var property,
                bHasparentNode;

            if (protectedProps === undefined && declaration.protected !== undefined) {
                protectedProps = declaration.protected;

                delete declaration.protected;
            }


            for (property in declaration) {
                if (declaration.hasOwnProperty(property) && protectedProps.indexOf(property) === -1) {

                    if (typeof declaration[property] === 'object') {

                        bHasparentNode = parentNode !== undefined;

                        if (bHasparentNode) {

                            nodeMap[property] = parentNode.addChild();

                            if (declaration[property].meta !== undefined) {
                                this.applyMeta(nodeMap[property], declaration[property].meta);
                            }


                        } else {

                            nodeMap.root = targetScene.addChild();

                            if (declaration[property].meta !== undefined) {
                                this.applyMeta(nodeMap.root, declaration[property].meta);
                            }

                        }

                        this.setupDeclaration(declaration[property], nodeMap, ((bHasparentNode) ? nodeMap[property] : nodeMap.root), protectedProps);
                    }
                }
            }
        };


        // Perform the setup
        this.setupDeclaration(Declaration, this.nodeMap);

        // Provide access on the node/dom map
        return this.nodeMap;
    };
})(require('famous/dom-renderables/DOMElement'));


module.exports = Declarative;
