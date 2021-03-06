USE [DogBarberShop]
GO
/****** Object:  Table [dbo].[records]    Script Date: 5/27/2020 11:34:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[records](
	[user_id] [int] NOT NULL,
	[scheduled_date] [datetime] NOT NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[date_created] [datetime] NULL,
 CONSTRAINT [PK_records] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 5/27/2020 11:34:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[username] [nvarchar](50) NOT NULL,
	[password] [nvarchar](50) NOT NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
 CONSTRAINT [PK_users] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[records]  WITH CHECK ADD  CONSTRAINT [FK_records_users] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[records] CHECK CONSTRAINT [FK_records_users]
GO
/****** Object:  StoredProcedure [dbo].[AddNewRecord]    Script Date: 5/27/2020 11:34:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	adds a new record
-- =============================================
CREATE   PROCEDURE [dbo].[AddNewRecord] 
	@user_id int, @schedule_date datetime
AS
BEGIN
	insert into records(user_id, scheduled_date, date_created) values(@user_id, @schedule_date, GETDATE())
END
GO
/****** Object:  StoredProcedure [dbo].[AddNewUser]    Script Date: 5/27/2020 11:34:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[AddNewUser]
	@username nvarchar(50), @password nvarchar(50)
AS
BEGIN
	insert into users(username, password) values(@username, @password)
	select SCOPE_IDENTITY()
END
GO
/****** Object:  StoredProcedure [dbo].[DeleteRecord]    Script Date: 5/27/2020 11:34:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE   PROCEDURE [dbo].[DeleteRecord]
	@recordId int , @userId int
AS
BEGIN
	declare @author int;
	
	select @author = user_id from records where id = @recordId;
	if @author <> @userId 
		THROW 51000, 'User not permitted!' , 1;  
	else
		delete from records where id = @recordId
END
GO
/****** Object:  StoredProcedure [dbo].[GetAllRecords]    Script Date: 5/27/2020 11:34:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	returns JSON list of all records
-- =============================================
CREATE   PROCEDURE [dbo].[GetAllRecords] 
	@query nvarchar(100) = '',
	@from_date datetime ,
	@until_date datetime 
AS
BEGIN
	declare @result nvarchar(max)

	set @result = (select records.id,
	 records.user_id as userId, 
	 username as name, 
	 scheduled_date as scheduledDate,
	 date_created as dateCreated
	 from records inner join users on records.user_id = users.id
		  where users.username LIKE  '%' + @query + '%' 
			and scheduled_date >= @from_date
			and scheduled_date <= @until_date
	 for json path)
				
		  select ISNULL(@result, '[]')
END
GO
/****** Object:  StoredProcedure [dbo].[UpdateRecord]    Script Date: 5/27/2020 11:34:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	adds a new record
-- =============================================
CREATE   PROCEDURE [dbo].[UpdateRecord] 
	@recordId int, @user_id int, @schedule_date datetime
AS
BEGIN
	declare @author int;
	select @author = user_id from records where id = @recordId;

	if @author <> @user_id 
		THROW 51000, 'User not permitted!' , 1;  
	else
	update records set user_id = @user_id, scheduled_date = @schedule_date where id = @recordId
END
GO
