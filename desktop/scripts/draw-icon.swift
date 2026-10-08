import AppKit
import Foundation

let output = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
func color(_ hex: UInt32, _ alpha: CGFloat = 1) -> NSColor {
  NSColor(deviceRed: CGFloat((hex >> 16) & 255)/255, green: CGFloat((hex >> 8) & 255)/255, blue: CGFloat(hex & 255)/255, alpha: alpha)
}
func rect(_ x: CGFloat,_ y: CGFloat,_ w: CGFloat,_ h: CGFloat,_ radius: CGFloat,_ fill: NSColor) {
  fill.setFill(); NSBezierPath(roundedRect: NSRect(x:x,y:y,width:w,height:h),xRadius:radius,yRadius:radius).fill()
}
func stroke(_ path: NSBezierPath,_ fill: NSColor,_ width: CGFloat) {
  fill.setStroke(); path.lineWidth=width;path.lineCapStyle = .round;path.lineJoinStyle = .round;path.stroke()
}
func draw() {
  rect(64,64,896,896,204,color(0x1b3040))
  let edge=NSBezierPath(roundedRect:NSRect(x:84,y:84,width:856,height:856),xRadius:184,yRadius:184)
  stroke(edge,color(0xffffff,0.07),3)
  let belt=NSBezierPath();belt.move(to:NSPoint(x:220,y:350));belt.line(to:NSPoint(x:346,y:350));belt.curve(to:NSPoint(x:593,y:674),controlPoint1:NSPoint(x:492,y:350),controlPoint2:NSPoint(x:447,y:674));belt.line(to:NSPoint(x:804,y:674))
  stroke(belt,color(0x8fa7aa),132);stroke(belt,color(0x405a66),100)
  let dash:[CGFloat]=[8,18];belt.setLineDash(dash,count:2,phase:0);stroke(belt,color(0x89d7ba,0.45),3)
  for (x,y) in [(CGFloat(222),CGFloat(238)),(605,562)] {
    rect(x,y,26,254,12,color(0xeef1eb));rect(x+174,y,26,254,12,color(0xeef1eb));rect(x,y+224,200,30,14,color(0xeef1eb))
  }
  rect(271,309,100,83,20,color(0x52c6a4));rect(655,633,100,83,20,color(0x52c6a4))
  NSGraphicsContext.saveGraphicsState()
  let turn=NSAffineTransform();turn.translateX(by:508,yBy:522.5);turn.rotate(byDegrees:56);turn.concat()
  rect(-48,-41.5,96,83,20,color(0xa3efd3));NSGraphicsContext.restoreGraphicsState()
  for (x,y) in [(CGFloat(296),CGFloat(366)),(680,690)] {let shine=NSBezierPath();shine.move(to:NSPoint(x:x,y:y));shine.line(to:NSPoint(x:x+50,y:y));stroke(shine,color(0xe9fff6,0.85),9)}
}
for size in [16,32,64,128,256,512,1024] {
  guard let bitmap=NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:size,pixelsHigh:size,bitsPerSample:8,samplesPerPixel:4,hasAlpha:true,isPlanar:false,colorSpaceName:.deviceRGB,bytesPerRow:0,bitsPerPixel:0),let context=NSGraphicsContext(bitmapImageRep:bitmap) else {fatalError("Cannot create icon bitmap")}
  NSGraphicsContext.saveGraphicsState();NSGraphicsContext.current=context
  context.cgContext.scaleBy(x:CGFloat(size)/1024,y:CGFloat(size)/1024);draw();context.flushGraphics();NSGraphicsContext.restoreGraphicsState()
  guard let png=bitmap.representation(using:.png,properties:[:]) else {fatalError("Cannot encode icon")}
  let names: [String]
  switch size {case 16:names=["icon_16x16.png"];case 32:names=["icon_16x16@2x.png","icon_32x32.png"];case 64:names=["icon_32x32@2x.png"];case 128:names=["icon_128x128.png"];case 256:names=["icon_128x128@2x.png","icon_256x256.png"];case 512:names=["icon_256x256@2x.png","icon_512x512.png"];default:names=["icon_512x512@2x.png"]}
  for name in names {try png.write(to:output.appendingPathComponent(name))}
}
