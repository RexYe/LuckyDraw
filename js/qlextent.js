var qlextent = qlextent || {};
//属性和方法分离
qlextent.extendClass = function (classDef, functions) {
    for (var fn in functions)
        classDef.prototype[fn] = functions[fn];

    classDef.thisClass = classDef.prototype;
};
//继承
qlextent.inherit = function (subClass, superClass) {
    var F = function () { };
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    //Decouple the subclass and superclass, useful when calling overridden function in superclass.
    subClass.superClass = superClass.prototype;
};
