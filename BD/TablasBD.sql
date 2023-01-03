

use POS

go

create table Local(
	idLocal int primary key identity(1,1),
	descripcion varchar(50),
	esActivo bit,
	fechaRegistro datetime default getdate()
)
go

create table Rol(
idRol int primary key identity(1,1),
descripcion varchar(50),
esActivo bit,
fechaRegistro datetime default getdate()
)

go

create table Usuario(
idUsuario int primary key identity(1,1),
nombreApellidos varchar(100),
correo varchar(40),
idRol int references Rol(idRol),
idLocal int references Local(idLocal),
clave varchar(40),
esActivo bit
)

go

create table Categoria(
idCategoria int primary key identity(1,1),
descripcion varchar(50),
esActivo bit,
fechaRegistro datetime default getdate()
)


go 
create table Producto (
idProducto int primary key identity(1,1),
nombre varchar(100),
idCategoria int references Categoria(idCategoria),
codBarras varchar(100),
precio decimal(10,2),
esActivo bit,
fechaRegistro datetime default getdate()
)

go

create table StockProducto (
idStockProducto int primary key identity(1,1),
idProducto int references Producto(idProducto),
stock int,
esActivo bit,
fechaModificacion datetime default getdate()
)

go


create table NumeroDocumento(
idNumeroDocumento int primary key identity(1,1),
ultimo_Numero int not null,
fechaRegistro datetime default getdate()
)
go

create table Venta(
idVenta int primary key identity(1,1),
numeroDocumento varchar(40),
tipoPago varchar(50),
fechaRegistro datetime default getdate(),
neto decimal(10,2),
iva decimal(10,2),
total decimal(10,2)
)
go

create table DetalleVenta(
idDetalleVenta int primary key identity(1,1),
idVenta int references Venta(idVenta),
idProducto int references Producto(idProducto),
cantidad int,
precio decimal(10,2),
neto decimal(10,2),
iva decimal(10,2),
total decimal(10,2)
)

create table Compra(
idCompra int primary key identity(1,1),
numeroDocumento varchar(40),
tipoPago varchar(50),
fechaRegistro datetime default getdate(),
neto decimal(10,2),
iva decimal(10,2),
total decimal(10,2)
)
go

create table DetalleCompra(
idDetalleCompra int primary key identity(1,1),
idCompra int references Compra(idCompra),
idProducto int references Producto(idProducto),
cantidad int,
precio decimal(10,2),
neto decimal(10,2),
iva decimal(10,2),
total decimal(10,2)
)
