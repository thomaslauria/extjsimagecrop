/**
 * Licence:
 * You can use the Code as you like, only the URL http//www.thomas-lauria.de/ has to be in the used Files / Code 
 * @author Thomas Lauria
 * http://www.thomas-lauria.de
 */

Ext.ns('Ext.ux');
Ext.define('Ext.ux.ImageCrop', {
  requires:['Ext.Img'],
  extend: 'Ext.Component',
  minWidth: 50,
  minHeight: 50,
  quadratic: false,
  preserveRatio: true,
  autoEl: {
    tag: 'div',
    children: [{
      tag: 'div',
      cls: 'image-crop-wrapper',
      style: {
        background: '#ffffff',
        opacity: 0.5,
        position: 'absolute'
      }
    }]
  },
  initComponent: function() {
    this.preserveRatio = this.quadratic || this.preserveRatio;
    this.callParent(arguments);
  },
  getResultPosition: function() {
    var me = this, 
        parent = me.getBox(), 
        img = me.image.getBox(),
        res = {
          x: (img.x - parent.x),
          y: (img.y - parent.y),
          width: img.width,
          height: img.height
        };
    me.image.getEl().setStyle({
      'background-position':(-res.x)+'px '+(-res.y)+'px'
    });
    return res;
  },
  /**
   * @return Object
   */
  getCropData: function() {
    return this.getResultPosition();
  },
  onRender : function(ct, position){
    var me = this,
        height = me.height,
        width = me.width,
        wrap = me.el.down('.image-crop-wrapper'),
        dragConf = {
          constrain: true,
          constrainTo:me.el,
          listeners: {
            dragstart: function() {
              this.image.getEl().setStyle({
                'background':'transparent'
              });
            },
            dragend: function() {
              var me = this,
                  res = me.getResultPosition();
              me.image.getEl().setStyle({
                'background-image': 'url('+me.src+')',
                'background-repeat': 'no-repeat'
              });
              me.fireEvent('changeCrop', me, res);
              me.fireEvent('moveCrop', me, res);
            },
            scope: me
          }
        };
    wrap.setSize(me.width, me.height);
    
    me.el.setStyle({
      background: 'url('+me.src+') no-repeat left top'
    });
    if(me.quadratic){
      if(height > width) {
        height = width;
      }
      else {
        width = height;
      }
    }
    me.image = Ext.create('Ext.Img',{
      opacity: 1.0,
      renderTo: me.el,
      resizable: {
        pinned: true,
        preserveRatio: me.preserveRatio
      },
      draggable: dragConf,
      constrainTo: me.el, 
      src: Ext.BLANK_IMAGE_URL,
      height: height,
      width: width,
      style:{
        cursor: 'move',
        position: 'absolute',
        background: 'url('+me.src+') no-repeat left top'
      },
      listeners: {
        resize: function() {
          res = me.getResultPosition();
          me.fireEvent('changeCrop', me, res);
          me.fireEvent('resizeCrop', me, res);
        }
      }
    });
  }
});