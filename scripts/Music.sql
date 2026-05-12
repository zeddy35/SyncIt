USE [master]
GO
/****** Object:  Database [Music_New]    Script Date: 12.05.2026 13:45:18 ******/
CREATE DATABASE [Music_New]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'music', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\Music_New.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'music_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\Music_New_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [Music_New] SET COMPATIBILITY_LEVEL = 130
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Music_New].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Music_New] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Music_New] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Music_New] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Music_New] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Music_New] SET ARITHABORT OFF 
GO
ALTER DATABASE [Music_New] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [Music_New] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Music_New] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Music_New] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Music_New] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Music_New] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Music_New] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Music_New] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Music_New] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Music_New] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Music_New] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Music_New] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Music_New] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Music_New] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Music_New] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Music_New] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Music_New] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Music_New] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Music_New] SET  MULTI_USER 
GO
ALTER DATABASE [Music_New] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Music_New] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Music_New] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Music_New] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Music_New] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Music_New] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [Music_New] SET QUERY_STORE = OFF
GO
USE [Music_New]
GO
/****** Object:  Table [dbo].[ALBUM]    Script Date: 12.05.2026 13:45:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ALBUM](
	[albumID] [int] IDENTITY(1,1) NOT NULL,
	[title] [varchar](100) NOT NULL,
	[year] [int] NULL,
	[singerID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[albumID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[INSTRUMENT]    Script Date: 12.05.2026 13:45:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[INSTRUMENT](
	[insID] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[insID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[INSTRUMENT_SINGER]    Script Date: 12.05.2026 13:45:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[INSTRUMENT_SINGER](
	[singerID] [int] NOT NULL,
	[insID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[singerID] ASC,
	[insID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SINGER]    Script Date: 12.05.2026 13:45:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SINGER](
	[singerID] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](100) NULL,
	[style] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[singerID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[ALBUM] ON 
GO
INSERT [dbo].[ALBUM] ([albumID], [title], [year], [singerID]) VALUES (1, N'Festival', 2006, 1)
GO
INSERT [dbo].[ALBUM] ([albumID], [title], [year], [singerID]) VALUES (2, N'Patron', 2009, 11)
GO
INSERT [dbo].[ALBUM] ([albumID], [title], [year], [singerID]) VALUES (3, N'Mançoloji', 1999, 6)
GO
INSERT [dbo].[ALBUM] ([albumID], [title], [year], [singerID]) VALUES (4, N'Sakin Ol', 1992, 4)
GO
INSERT [dbo].[ALBUM] ([albumID], [title], [year], [singerID]) VALUES (5, N'Turuncu', 2001, 4)
GO
INSERT [dbo].[ALBUM] ([albumID], [title], [year], [singerID]) VALUES (6, N'Sade', 2013, 4)
GO
SET IDENTITY_INSERT [dbo].[ALBUM] OFF
GO
SET IDENTITY_INSERT [dbo].[INSTRUMENT] ON 
GO
INSERT [dbo].[INSTRUMENT] ([insID], [name]) VALUES (1, N'Piano')
GO
INSERT [dbo].[INSTRUMENT] ([insID], [name]) VALUES (2, N'Piano')
GO
INSERT [dbo].[INSTRUMENT] ([insID], [name]) VALUES (3, N'Drum kit')
GO
INSERT [dbo].[INSTRUMENT] ([insID], [name]) VALUES (4, N'Zurna')
GO
INSERT [dbo].[INSTRUMENT] ([insID], [name]) VALUES (5, N'Baðlama')
GO
INSERT [dbo].[INSTRUMENT] ([insID], [name]) VALUES (6, N'Guitar')
GO
INSERT [dbo].[INSTRUMENT] ([insID], [name]) VALUES (7, N'Harmonica')
GO
INSERT [dbo].[INSTRUMENT] ([insID], [name]) VALUES (8, N'Trumpet')
GO
INSERT [dbo].[INSTRUMENT] ([insID], [name]) VALUES (9, N'Violin')
GO
SET IDENTITY_INSERT [dbo].[INSTRUMENT] OFF
GO
INSERT [dbo].[INSTRUMENT_SINGER] ([singerID], [insID]) VALUES (1, 1)
GO
INSERT [dbo].[INSTRUMENT_SINGER] ([singerID], [insID]) VALUES (1, 3)
GO
INSERT [dbo].[INSTRUMENT_SINGER] ([singerID], [insID]) VALUES (2, 4)
GO
INSERT [dbo].[INSTRUMENT_SINGER] ([singerID], [insID]) VALUES (3, 1)
GO
INSERT [dbo].[INSTRUMENT_SINGER] ([singerID], [insID]) VALUES (3, 8)
GO
INSERT [dbo].[INSTRUMENT_SINGER] ([singerID], [insID]) VALUES (4, 1)
GO
INSERT [dbo].[INSTRUMENT_SINGER] ([singerID], [insID]) VALUES (4, 5)
GO
INSERT [dbo].[INSTRUMENT_SINGER] ([singerID], [insID]) VALUES (4, 6)
GO
INSERT [dbo].[INSTRUMENT_SINGER] ([singerID], [insID]) VALUES (4, 7)
GO
INSERT [dbo].[INSTRUMENT_SINGER] ([singerID], [insID]) VALUES (11, 1)
GO
INSERT [dbo].[INSTRUMENT_SINGER] ([singerID], [insID]) VALUES (11, 3)
GO
SET IDENTITY_INSERT [dbo].[SINGER] ON 
GO
INSERT [dbo].[SINGER] ([singerID], [name], [style]) VALUES (1, N'Kenan Doðulu', N'Pop')
GO
INSERT [dbo].[SINGER] ([singerID], [name], [style]) VALUES (2, N'Orhan Gencebay', N'Arabesk')
GO
INSERT [dbo].[SINGER] ([singerID], [name], [style]) VALUES (3, N'Candan Erçetin', N'Pop')
GO
INSERT [dbo].[SINGER] ([singerID], [name], [style]) VALUES (4, N'Sertab Erener', N'Pop')
GO
INSERT [dbo].[SINGER] ([singerID], [name], [style]) VALUES (5, N'Gülben Ergen', N'Arabesk')
GO
INSERT [dbo].[SINGER] ([singerID], [name], [style]) VALUES (6, N'Barýþ Manço', N'Pop')
GO
INSERT [dbo].[SINGER] ([singerID], [name], [style]) VALUES (7, N'Murat Boz', N'Pop')
GO
INSERT [dbo].[SINGER] ([singerID], [name], [style]) VALUES (8, N'Erol Büyükburç', N'Pop')
GO
INSERT [dbo].[SINGER] ([singerID], [name], [style]) VALUES (9, N'Demir Demirkan', N'Rock')
GO
INSERT [dbo].[SINGER] ([singerID], [name], [style]) VALUES (10, N'Zeynep Dizdar', N'Pop')
GO
INSERT [dbo].[SINGER] ([singerID], [name], [style]) VALUES (11, N'Ferhat Göçer', N'Pop')
GO
SET IDENTITY_INSERT [dbo].[SINGER] OFF
GO
ALTER TABLE [dbo].[ALBUM]  WITH CHECK ADD FOREIGN KEY([singerID])
REFERENCES [dbo].[SINGER] ([singerID])
GO
ALTER TABLE [dbo].[INSTRUMENT_SINGER]  WITH CHECK ADD FOREIGN KEY([insID])
REFERENCES [dbo].[INSTRUMENT] ([insID])
GO
ALTER TABLE [dbo].[INSTRUMENT_SINGER]  WITH CHECK ADD FOREIGN KEY([singerID])
REFERENCES [dbo].[SINGER] ([singerID])
GO
/****** Object:  StoredProcedure [dbo].[sp_AddAlbum]    Script Date: 12.05.2026 13:45:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_AddAlbum]
    @title VARCHAR(100),
    @year INT,
    @singerid INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Album (title, year, singerID)
    VALUES (@title, @year, @singerid);
END
GO
USE [master]
GO
ALTER DATABASE [Music_New] SET  READ_WRITE 
GO
