/**
 * Licence:
 * You can use the Code as you like, only the URL http//www.thomas-lauria.de/ has to be in the used Files / Code 
 * @author Thomas Lauria
 * http://www.thomas-lauria.de
 */
Ext.ns('Extamples');
Ext.define('Extamples.CropWindow', {
  requires:['Ext.Window'],
  extend: 'Ext.Window',
  cropData: null,
  imageUrl: '',
  
  title: 'Image Crop Utility',
  width: 660,
  height: 510,
  modal: true,
  initComponent: function() {
    this.fbar = {
        xtype: 'toolbar',
        items: [
          {
            xtype: 'button',
            text: 'cancel',
            itemId: 'cancelButton'
          },
          {
            xtype: 'button',
            text: 'save',
            itemId: 'saveButton'
          }
        ]
      };    
    // I am using an image preloader here, for getting the initial height and width
    this.callParent(arguments);
    var imgLoad = new Image();
    imgLoad.onload = (function(){
      this.setSize(imgLoad.width + 20, imgLoad.height + 70);
      var crop = new Ext.ux.ImageCrop({
        src: this.imageUrl,
        width: imgLoad.width,
        height: imgLoad.height,
        minWidth: 110,
        minHeight: 110,
        quadratic: true
      });
      crop.on('changeCrop', function(foo,x) {this.cropData = x;}, this);
      this.add(crop);
    }).bind(this);
    imgLoad.src = this.imageUrl;
    
    // handler for the buttons
    this.down('#cancelButton').on('click', this.close, this);
    this.down('#saveButton').on('click', this.saveCrop, this);
  },
  saveCrop: function() {
    Ext.get('output-2').update('X Offset: '+this.cropData.x+' Y Offset: '+this.cropData.y+' Width: '+this.cropData.width+' Height: '+this.cropData.height);
    if(this.fireEvent('save', this) === false){
      return this;
    }
    this.close();
    
    /*
     *  or you can use a ajax call!
    Ext.Ajax.request({
      url: this.imageUrl,
      method: 'post',
      params: this.cropData,
      success: function(){
        if(this.fireEvent('save', this) === false){
          return this;
        }
        this.close();
      },
      scope: this
    });
    */
  }
});
