/*
 * @author Paul Liu
 */

var EC_OK = 0;
var EC_INVALID_OBJECT = 1;
var EC_IMPOSSIBLE_CASE = 2;
var EC_OUT_OF_RANGE = 3;

function MyObject () {};

MyObject.prototype = new Object ();

MyObject.prototype.call = function (thisObject, args) {};

MyObject.IsUndefinedAndNull = function (obj) {
  if (obj === undefined) return true;
  if (obj === null) return true;
  return false;
};

function UIObject (parentId) {
  if (MyObject.IsUndefinedAndNull (parentId)) return EC_INVALID_OBJECT;

  this.parentElementId = parentId;
  this.elementId = null;
  return EC_OK;
};

UIObject.prototype = new MyObject ();

UIObject.prototype.GetParentElement = function (parentElement) {
  if (MyObject.IsUndefinedAndNull (parentElement)) return EC_INVALID_OBJECT;
  if (MyObject.IsUndefinedAndNull (this.parentElementId)) return EC_IMPOSSIBLE_CASE;

  parentElement.Parent = document.getElementById (this.parentElementId);
  if (MyObject.IsUndefinedAndNull (parentElement.Parent)) return EC_IMPOSSIBLE_CASE;

  return EC_OK;
};

UIObject.prototype.GetElement = function (element) {
  if (MyObject.IsUndefinedAndNull (element)) return EC_INVALID_OBJECT;
  if (MyObject.IsUndefinedAndNull (this.elementId)) return EC_IMPOSSIBLE_CASE;

  element.Element = document.getElementById (this.elementId);
  if (MyObject.IsUndefinedAndNull (element.Element)) return EC_IMPOSSIBLE_CASE;
  return EC_OK;
};

UIObject.prototype.Paint = function () {};

function InventoryDivide (parentId) {
  var ret = UIObject.call (this, parentId);
  if (ret !== EC_OK) return ret;
  
  this.iconCount = 8;
  this.icons = null;

  this.products = null;
  this.productCount = 20;
  return EC_OK;
};

InventoryDivide.prototype = new UIObject (null);

var gCellWidth = 200;

InventoryDivide.prototype.CreateProducts = function () {
  this.products = new Array (this.productCount);
  var i = -1;
  while (++i < this.productCount) {
    var name = "Product name " + i;
    var href = "http://www.google.com";
    var title = "Product title " + i;
    var icon = "thumnail.png";
    var proObj = new Product (name, href, title, icon);
    this.products[i] = proObj;
  }

  return EC_OK;
};

InventoryDivide.prototype.Paint = function () {
  var pe = {};
  var ret = this.GetParentElement (pe);
  if (ret !== EC_OK) return ret;
  if (MyObject.IsUndefinedAndNull (pe.Parent)) return EC_IMPOSSIBLE_CASE;
  pe = pe.Parent;

  var divInventoryId = this.parentElementId + "_inventory";
  this.elementId = divInventoryId;

  var divInventory = document.createElement ("div");
  divInventory.id = divInventoryId;
  divInventory.style.margin = "100px";
  pe.appendChild (divInventory);

  var tableInventory = document.createElement ("table");
  tableInventory.id = this.elementId + "_table";
  tableInventory.style.width = "100%";
  tableInventory.style.backgroundColor = "transparent";
  divInventory.appendChild (tableInventory);

  var row = -1;
  var column = -1;

  var divIconRow = null;
  var iconRow = null;

  this.icons = new Array (this.iconCount);

  var rowCellCount = 4;
  if (divInventory.offsetWidth > 880) {
    rowCellCount = 4;
  } else {
    rowCellCount = 2;
  }

  gCellWidth = (divInventory.offsetWidth - 360) / rowCellCount;
  if (gCellWidth > 220) gCellWidth = 220;
  if (gCellWidth < 150) gCellWidth = 150;

  var i = -1;
  while (++i < this.iconCount) {
    var mod = i % rowCellCount;
    if (mod === 0) {
      iconRow = document.createElement("tr");
      ++row;
      iconRow.id = tableInventory.id + "_row" + row;
      tableInventory.appendChild (iconRow);
      column = -1;
    }

    var iconCell = document.createElement ("td");
    ++column;
    iconCell.id = iconRow.id + "_cell" + column;
    iconRow.appendChild (iconCell);
    this.icons[i] = new ProductIcon (iconCell.id, this.products[i]);
    this.icons[i].Paint ();
  }
  
  return EC_OK;
};

function ProductIconElement (parentId) {
  var ret = UIObject.call (this, parentId);
  if (ret !== EC_OK) return ret;

  return EC_OK;
};

ProductIconElement.prototype = new UIObject (null);

function ColorStripe (parentId) {
  var ret = ProductIconElement.call (this, parentId);
  if (ret !== EC_OK) return ret;
  return EC_OK;
};


function IconRow (parentId, row) {
  var ret = ProductIconElement.call (this, parentId);
  if (ret != EC_OK) return ret;

  this.elementId = this.parentElementId + "row" + row;
  return EC_OK;
};

IconRow.prototype = new ProductIconElement (null);

IconRow.prototype.Paint = function () {
  var pe = {};
  var ret = this.GetParentElement (pe);
  if (ret != EC_OK) return ret;
  if (MyObject.IsUndefinedAndNull (pe.Parent)) return EC_IMPOSSIBLE_CASE;
  pe = pe.Parent;
  
  var divIconRow = document.createElement ("div");
  divIconRow.id = this.elementId;

  pe.appendChild (divIconRow);
  return EC_OK;
};

ColorStripe.prototype = new ProductIconElement (null);

ColorStripe.prototype.Paint = function () {
  var pe = {};
  var ret = this.GetParentElement (pe);
  if (ret !== EC_OK) return ret;
  if (MyObject.IsUndefinedAndNull (pe.Parent)) return EC_IMPOSSIBLE_CASE;
  pe = pe.Parent;

  var divColorStripe = document.createElement ("div");
  divColorStripe.style.backgroundColor = "RGB(232, 132, 30)";
  divColorStripe.style.width = "100%";
  divColorStripe.style.height = "3px";    
  pe.appendChild (divColorStripe);

  return EC_OK;
};

function NameLabel (parentId, name) {
  var ret = ProductIconElement.call (this, parentId);
  if (ret !== EC_OK) return ret;
  
  this.Name = name;
  return EC_OK;
};

NameLabel.prototype = new ProductIconElement (null);

NameLabel.prototype.Paint = function () {
  var pe = {};
  var ret = this.GetParentElement (pe);
  if (ret !== EC_OK) return ret;
  if (MyObject.IsUndefinedAndNull (pe.Parent)) return EC_IMPOSSIBLE_CASE;
  pe = pe.Parent;

  var divNameLabel = document.createElement ("div");
  divNameLabel.style.textAlign = "center";
  divNameLabel.innerHTML = this.Name;
  pe.appendChild (divNameLabel);
  return EC_OK;
};

function Thumbnail (parentId, url) {
  var ret = ProductIconElement.call (this, parentId);
  if (ret !== EC_OK) return ret;

  if (MyObject.IsUndefinedAndNull (url)) return EC_IMPOSSIBLE_CASE;
  this.URL = url;
  return EC_OK;
};

Thumbnail.prototype = new ProductIconElement (null);

Thumbnail.prototype.Paint = function () {
  var pe = {};
  var ret = this.GetParentElement (pe);
  if (ret !== EC_OK) return ret;
  if (MyObject.IsUndefinedAndNull (pe.Parent)) return EC_IMPOSSIBLE_CASE;
  pe = pe.Parent;

  this.elementId = this.parentElementId + "_thumbnail";

  var divThumbnail = document.createElement ("div");
  divThumbnail.id = this.elementId;
  divThumbnail.style.width = "100%";
  divThumbnail.style.height = gCellWidth * 0.63 + "px";
  divThumbnail.style.backgroundImage = "url('" + this.URL + "')";
  divThumbnail.style.backgroundRepeat = "no-repeat";
  divThumbnail.style.backgroundPosition = "center center";
  pe.appendChild (divThumbnail);

  return EC_OK;
};

function ProductAnchor (parentId, url, text, title) {
  var ret = ProductIconElement.call (this, parentId);
  if (ret !== EC_OK) return ret;

  if (MyObject.IsUndefinedAndNull (url)) return EC_INVALID_OBJECT;
  this.URL = url;
  this.Text = text;
  this.Title = title;
  return EC_OK;
};

ProductAnchor.prototype = new ProductIconElement (null);

ProductAnchor.prototype.Paint = function () {
  var pe = {};
  var ret = this.GetParentElement (pe);
  if (ret !== EC_OK) return ret;
  if (MyObject.IsUndefinedAndNull (pe.Parent)) return EC_IMPOSSIBLE_CASE;
  pe = pe.Parent;

  this.elementId = this.parentElementId + "_a";

  var aProductAnchor = document.createElement ("a");
  aProductAnchor.id = this.elementId;
  aProductAnchor.href = this.URL;
  aProductAnchor.title = this.Title;
  pe.appendChild (aProductAnchor);

  var pThumb = new Thumbnail (this.elementId, "thumbnail.png");
  pThumb.Paint ();

  var pColorStripe = new ColorStripe (this.elementId);
  pColorStripe.Paint ();

  var pNameLabel = new NameLabel (this.elementId, this.Text);
  pNameLabel.Paint ();
  return EC_OK;
};

function CloseButton(parentId, url) {
  var ret = ProductIconElement.call (this, parentId);
  if (ret !== EC_OK) return ret;  

  this.URL = url;
  return EC_OK;
};

CloseButton.prototype = new ProductIconElement (null);

CloseButton.prototype.Show = function (visibility) {
  if (MyObject.IsUndefinedAndNull (visibility)) return EC_INVALID_OBJECT;
  var element = {};
  var ret = this.GetElement (element);
  if (ret != EC_OK) return ret;
  if (MyObject.IsUndefinedAndNull (element.Element)) return EC_IMPOSSIBLE_CASE;
  element = element.Element;

  element.style.visibility = visibility;
};

function CloseProduct (elementId) {
  if (MyObject.IsUndefinedAndNull (elementId)) return EC_INVALID_OBJECT;
  var pi = document.getElementById (elementId);
  if (MyObject.IsUndefinedAndNull (pi)) return EC_OK;
  
  var childNode = pi.firstChild;
  while (!MyObject.IsUndefinedAndNull (childNode)) {
    pi.removeChild(childNode);

    childNode = pi.firstChild;
  }
  pi.style.backgroundColor = "RGB(150, 150, 150)";
};

CloseButton.prototype.Paint = function () {
  var pe = {};
  var ret = this.GetParentElement (pe);
  if (ret !== EC_OK) return ret;
  if (MyObject.IsUndefinedAndNull (pe.Parent)) return EC_INVALID_OBJECT;
  pe = pe.Parent;

  this.elementId = this.parentElementId + "_closebutton";

  var divCloseButton = document.createElement ("div");
  divCloseButton.id = this.elementId;
  divCloseButton.style.position = "absolute";
  divCloseButton.style.width = "16px";
  divCloseButton.style.height = "16px";
  divCloseButton.style.right = "0";
  divCloseButton.style.top = "0";
  divCloseButton.style.backgroundImage = "url('" + this.URL + "')";
  divCloseButton.style.backgroundColor = "transparent";
  divCloseButton.style.backgroundRepeat = "no-repeat";
  divCloseButton.title = "Don't show on this page";
  divCloseButton.style.visibility = "hidden";
  pe.appendChild (divCloseButton);

  var piElementId = this.parentElementId;

  if (divCloseButton.attachEvent) {
    divCloseButton.attachEvent ('onclick',
        function () {CloseProduct (piElementId);}
        );
  } else if (divCloseButton.addEventListener) {
    divCloseButton.addEventListener('click',
      function () {CloseProduct (piElementId);},
      false
      );
  } else {
    return EC_IMPOSSIBLE_CASE;
  }

  return EC_OK;
};

function ProductIcon (parentId, proObj) {
  var ret = ProductIconElement.call (this, parentId);
  if (ret !== EC_OK) return ret;

  if (MyObject.IsUndefinedAndNull (proObj)) return EC_INVALID_OBJECT;
  this.Product = proObj;
  return EC_OK;
};

ProductIcon.prototype = new ProductIconElement (null);

function ShowCloseButton (elementId, visibility) {
  if (MyObject.IsUndefinedAndNull (elementId)) return EC_INVALID_OBJECT;
  if (MyObject.IsUndefinedAndNull (visibility)) return EC_INVALID_OBJECT;

  var cb = document.getElementById (elementId);
  if (MyObject.IsUndefinedAndNull (cb)) return EC_OK;
  cb.style.visibility = visibility;
  return EC_OK;
};

ProductIcon.prototype.Paint = function () {
  var pe = {};
  var ret = this.GetParentElement (pe);
  if (ret != EC_OK) return ret;
  if (MyObject.IsUndefinedAndNull (pe.Parent)) return EC_INVALID_OBJECT;
  pe = pe.Parent;

  this.elementId = this.parentElementId + "_" + this.Product.productName;

  var divProductIcon = document.createElement ("div");
  divProductIcon.id = this.elementId;
  divProductIcon.style.position = "relative";
  divProductIcon.style.width = gCellWidth + "px";
  divProductIcon.style.height = gCellWidth * 0.771 + "px";
  divProductIcon.style.margin = "20px";

  pe.appendChild (divProductIcon);

  var pa = new ProductAnchor (this.elementId, this.Product.productHref, this.Product.productName, this.Product.productTitle);
  ret = pa.Paint ();
  if (ret !== EC_OK) return ret;

  var closeButton = new CloseButton (this.elementId, "closebutton.png");
  ret = closeButton.Paint ();
  if (ret !== EC_OK) return ret;

  var cbElementId = closeButton.elementId;

  if (divProductIcon.attachEvent) {
    divProductIcon.attachEvent ('onmouseover',
        function () {ShowCloseButton (cbElementId, "visible");}
        );
    divProductIcon.attachEvent ('onmouseout',
        function () {ShowCloseButton (cbElementId, "hidden");}
        );
  } else if (divProductIcon.addEventListener) {
    divProductIcon.addEventListener ('mouseover',
        function () {ShowCloseButton (cbElementId, "visible");},
        false
        );
    divProductIcon.addEventListener ('mouseout',
        function () {ShowCloseButton (cbElementId, "hidden");},
        false
        );
  } else {
    return EC_IMPOSSIBLE_CASE;
  }
  return EC_OK;
};

function Product (name, href, title, icon) {
  if (MyObject.IsUndefinedAndNull (name)) return EC_INVALID_OBJECT;
  if (MyObject.IsUndefinedAndNull (href)) return EC_INVALID_OBJECT;
  if (MyObject.IsUndefinedAndNull (title)) return EC_INVALID_OBJECT;
  if (MyObject.IsUndefinedAndNull (icon)) return EC_INVALID_OBJECT;

  this.productName = name;
  this.productHref = href;
  this.productTitle = title;
  this.productIcon = icon;
};

Product.prototype = new MyObject ();

function Resize (invDivObj) {
  if (MyObject.IsUndefinedAndNull (invDivObj)) return EC_INVALID_OBJECT;

  var divInv = document.getElementById (invDivObj.elementId);
  var child = divInv.firstChild;
  while (!MyObject.IsUndefinedAndNull (child)) {
    divInv.removeChild (child);
    child = divInv.firstChild;
  }

  invDivObj.Paint ();
};

function WindowResize (invDivObj) {
  setTimeout('document.location.reload()', 0);
};

function body_onload (parentElement) {
  if (MyObject.IsUndefinedAndNull (parentElement)) return EC_INVALID_OBJECT;
  var parentId = parentElement.id;
  var id = new InventoryDivide (parentId);
  var ret = id.CreateProducts ();
  if (ret !== EC_OK) return ret;
  ret = id.Paint ();
  if (ret !== EC_OK) return ret;

  if (window.attachEvent) {
    window.attachEvent ('onresize',
        function () { WindowResize (id);}
        );
  } else {
    window.addEventListener ('resize',
        function () {WindowResize (id);},
        false
        );
  }
};
